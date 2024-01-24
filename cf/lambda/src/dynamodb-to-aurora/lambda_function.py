import sys
import boto3
import os
import logging
import psycopg2
import re
from decimal import Decimal
import json
import pandas as pd
import awswrangler as wr

def lambda_handler(event, context):


    con = wr.postgresql.connect("fg-adb-glueConnector-aurora-db-dev")
    cur = con.cursor()
    for record in event['Records']:
        # Get the item from the record
        event_name = record['eventName']
        if event_name == 'INSERT' or event_name=='UPDATE':
            taskId = record['dynamodb']
            stops = record['dynamodb']['NewImage']['stops']['L']
            #print(stops)
            metadata = record['dynamodb']['NewImage']
            # stopJson = json.loads(stops)
            normalizeTask = pd.json_normalize(
              metadata
            ).drop(columns=['stops.L'])

            normalizeStops = pd.json_normalize(
              stops,
            )


            normalizeStops.columns = normalizeStops.columns.str.rsplit('.', n=1).str[0].str.split('.').str[-1]

            stopsList = []

            for columns in normalizeStops.columns:
                stopsList.append(columns)

            normalizeStops['stops'] = normalizeStops[stopsList].apply(lambda x: x.to_json(), axis=1)
            normalizeStops = normalizeStops.drop(stopsList, axis=1)

            normalizeStops['adiona_daily_run_id.S'] = normalizeTask['adiona_daily_run_id.S'][0]

            normalizeStops = normalizeStops.groupby('adiona_daily_run_id.S')['stops'].apply(','.join).reset_index()

            normalizeStops['stops'] = '[' + normalizeStops['stops'] + ']'

            mergeFrames = normalizeTask.merge(normalizeStops, on='adiona_daily_run_id.S', how='inner')

            mergeFrames.columns = mergeFrames.columns.str.rsplit('.', n=1).str[0].str.split('.').str[-1]


            ##Expected Columns

            expected = [
                'adiona_daily_run_id'
                ,'adiona_daily_task_id'
                ,'allowable_early_swipe_out'
                ,'allowable_late_swipe_out'
                ,'business_unit_id'
                ,'business_unit_name'
                ,'created_by_id'
                ,'created_timestamp'
                ,'early_swipe_in_acceptance'
                ,'employee_business_unit_id'
                ,'employee_business_unit_name'
                ,'employee_first_name'
                ,'employee_id'
                ,'employee_last_name'
                ,'employee_middle_name'
                ,'end_deadhead_distance'
                ,'end_deadhead_time'
                ,'expected_end_time'
                ,'expected_start_time'
                ,'expiration_time'
                ,'focus_task_name'
                ,'is_adiona_edited'
                ,'is_emp_absent'
                ,'is_focus2_generated'
                ,'is_splitted'
                ,'is_task_pseudo_cancelled'
                ,'last_updated_by_id'
                ,'last_updated_timestamp'
                ,'late_swipe_in_acceptance'
                ,'ordering'
                ,'original_task_name'
                ,'original_template_id'
                ,'orig_expected_end_time'
                ,'orig_expected_start_time'
                ,'route_type'
                ,'run_code'
                ,'run_date'
                ,'run_description'
                ,'run_key'
                ,'run_template_id'
                ,'run_type'
                ,'sce_impacted'
                ,'sce_offset'
                ,'school_calendar_event'
                ,'school_district_id'
                ,'school_district_name'
                ,'school_id'
                ,'stops'
                ,'task_end_time'
                ,'task_name'
                ,'task_start_time'
                ,'task_template_id'
                ,'time_zone'
                ,'version'
                ]

            ##If the column exists then take the value if not then column is null
            mergeFramesSelect = mergeFrames.reindex(expected, axis=1)
            wr.postgresql.to_sql(
            df=mergeFramesSelect,
            con=con,
            schema='test_data_schema',
            table='adiona_daily_run_test',
            mode='upsert',
            upsert_conflict_columns=['adiona_daily_run_id']
            )

            con.close()


        elif event_name == 'REMOVE':
            keys = record['dynamodb']['Keys']
            key_item = {k: v.get('S', v.get('N', None)) for k, v in keys.items()}
            #where clause
            where_clause = ' AND '.join([str(column_name) + " = '" + str(key_item.get(column_name)) + "'"  for column_name in key_item])
            cur.execute(f"DELETE FROM test_data_schema.adiona_daily_run_test  WHERE {where_clause}")
            con.close()


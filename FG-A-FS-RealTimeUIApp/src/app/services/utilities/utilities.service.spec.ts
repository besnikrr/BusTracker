import { TestBed } from "@angular/core/testing";
import { UtilitiesService } from "./utilities.service";
import TrimbleMaps, { LngLatLike } from "@trimblemaps/trimblemaps-js";
import { busArrow, depotStart, destinationIcon } from "src/assets/icons";
import { RouteTaskStopEventVehicleFeature } from "src/first-student-api";

describe("UtilitiesService", () => {
  let service: UtilitiesService;

  beforeEach(() => {
    service = TestBed.inject(UtilitiesService);
  });

  it("should construct routes properly when called", () => {
    const taskData: RouteTaskStopEventVehicleFeature = {
      totalRuns: 4,
      completedRuns: 0,
      coordinates: {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: [[-121.401843, 36.8224254]],
        },
      },
      events: {},
      stops: {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [-121.86589, 37.279026],
            },
            properties: {
              id: "c1ffd167-4a39-4645-b886-8b27fedf4135",
              templateId: "393088071",
              type: "DP",
              status: null,
              name: "SVCTE",
              description: "SVCTE",
              number: "0",
              performed: "Y",
              actualArrivalTime: null,
            },
            id: "c1ffd167-4a39-4645-b886-8b27fedf4135",
          },
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [-121.86589, 37.279026],
            },
            properties: {
              id: "c1ffd167-4a39-4645-b886-8b27fedf4135",
              templateId: "393088071",
              type: "SC",
              status: null,
              name: "SVCTE",
              description: "SVCTE",
              number: "1",
              performed: "Y",
              actualArrivalTime: null,
            },
            id: "c1ffd167-4a39-4645-b886-8b27fedf4135",
          },
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [-121.9854, 37.270306],
            },
            properties: {
              id: "0b3ecaf5-8fb3-40b3-b8fe-ac76dc2e5a53",
              templateId: "396457503",
              type: "ST",
              status: null,
              name: "4805 Westmont Ave",
              description: "4805 Westmont Ave",
              number: "2",
              performed: "N",
              actualArrivalTime: null,
            },
            id: "0b3ecaf5-8fb3-40b3-b8fe-ac76dc2e5a53",
          },
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [-122.000496, 37.292683],
            },
            properties: {
              id: "cd671e54-d576-49e8-8ca3-498acaf994c1",
              templateId: "396457505",
              type: "ST",
              status: null,
              name: "18900 Prospect Rd",
              description: "18900 Prospect Rd",
              number: "3",
              performed: "N",
              actualArrivalTime: null,
            },
            id: "cd671e54-d576-49e8-8ca3-498acaf994c1",
          },
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [-121.97656, 37.222637],
            },
            properties: {
              id: "347ef156-7705-4837-a0f0-d7f34d06535b",
              templateId: "396457501",
              type: "ST",
              status: null,
              name: "20 High School Ct",
              description: "20 High School Ct",
              number: "4",
              performed: "N",
              actualArrivalTime: null,
            },
            id: "347ef156-7705-4837-a0f0-d7f34d06535b",
          },
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [-121.97656, 37.222637],
            },
            properties: {
              id: "347ef156-7705-4837-a0f0-d7f34d06535b",
              templateId: "396457501",
              type: "DP",
              status: null,
              name: "20 High School Ct",
              description: "20 High School Ct",
              number: "5",
              performed: "N",
              actualArrivalTime: null,
            },
            id: "347ef156-7705-4837-a0f0-d7f34d06535b",
          },
        ],
      },
      vehicle: {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [-121.401843, 36.8224254],
        },
        properties: {
          id: "101962",
          type: "string",
          assetNumber: "101962",
          fleetNumber: "",
          heading: 311,
          speed: 0,
          speedUnit: "MPH",
          eventId: "426d15de-59b2-4185-aad9-4ffdf226e999",
          eventType: "string",
          eventStartTime: "2023-03-22T13:49:48.000Z",
          eventEndTime: "2023-03-22T13:49:48.000Z",
        },
        id: "101962",
      },
    };
    const getBusIconSpy = spyOn(service, "getBusIcon").and.returnValue(busArrow);
    const response = service.constructRoutes(taskData, [[1, 1]], false, false);

    expect(response).toEqual([
      {
        routeId: "1",
        routeColor: "#C6E3FF",
        routePathOpacity: 0.8,
        truckConfig: TrimbleMaps.Common.TruckConfig.CONVENTIONAL_SCHOOL_BUS,
        inclFerryDist: true,
        frameRoute: false,
        stops: taskData.stops.features
          .filter((stop, index) => index !== taskData.stops.features.length - 1)
          .map(stop => stop.geometry["coordinates"] as LngLatLike),
        showStops: false,
        showArrows: true,
        arrowOptions: {
          size: 0.4,
          spacing: 100,
          fillColor: "#C6E3FF",
        },
      },
      {
        routeId: "2",
        routeColor: "#C1C1C1",
        routePathOpacity: 0.8,
        truckConfig: TrimbleMaps.Common.TruckConfig.CONVENTIONAL_SCHOOL_BUS,
        inclFerryDist: true,
        frameRoute: false,
        stops: [
          taskData.stops.features[0].geometry["coordinates"] as LngLatLike,
          taskData.stops.features[1].geometry["coordinates"] as LngLatLike,
        ],
        showStops: true,
        showArrows: true,
        arrowOptions: {
          size: 0.4,
          spacing: 100,
          fillColor: "#C6E3FF",
        },
        originIcon: {
          url: depotStart,
          size: 0.2,
          opacity: 1,
          textOpacity: 0,
        },
        stopIcon: {
          opacity: 0,
          textOpacity: 0,
        },
        destinationIcon: {
          opacity: 0,
          textOpacity: 0,
        },
      },
      {
        routeId: "3",
        routeColor: "#C1C1C1",
        routePathOpacity: 0.8,
        truckConfig: TrimbleMaps.Common.TruckConfig.CONVENTIONAL_SCHOOL_BUS,
        inclFerryDist: true,
        frameRoute: false,
        stops: [
          taskData.stops.features[taskData.stops.features.length - 1].geometry[
            "coordinates"
          ] as LngLatLike,
          taskData.stops.features[taskData.stops.features.length - 2].geometry[
            "coordinates"
          ] as LngLatLike,
        ],
        showStops: true,
        showArrows: true,
        arrowOptions: {
          size: 0.4,
          spacing: 100,
          fillColor: "#C6E3FF",
        },
        originIcon: {
          opacity: 0,
          textOpacity: 0,
        },
        stopIcon: {
          opacity: 0,
          textOpacity: 0,
        },
        destinationIcon: {
          url: depotStart,
          size: 0.2,
          opacity: 1,
          textOpacity: 0,
        },
      },
      {
        routeId: "4",
        routeColor: "#C6E3FF",
        routePathOpacity: 0.0,
        truckConfig: TrimbleMaps.Common.TruckConfig.CONVENTIONAL_SCHOOL_BUS,
        inclFerryDist: true,
        frameRoute: false,
        stops: taskData.stops.features
          .filter((stop, index) => index !== taskData.stops.features.length - 1)
          .map(stop => stop.geometry["coordinates"] as LngLatLike),
        showStops: true,
        originIcon: {
          opacity: 0,
          textOpacity: 0,
        },
        stopIcon: {
          size: 0.2,
          opacity: 1,
          textOpacity: 0.9,
        },
        destinationIcon: {
          url: destinationIcon,
          size: 0.2,
          opacity: 1,
          textOpacity: 0,
        },
        showArrows: false,
      },
      {
        routeId: "5",
        routeColor: "#082747",
        routePathOpacity: 0.8,
        truckConfig: TrimbleMaps.Common.TruckConfig.CONVENTIONAL_SCHOOL_BUS,
        inclFerryDist: true,
        frameRoute: false,
        stops: [[1, 1]],
        showStops: true,
        originIcon: {
          url: depotStart,
          size: 0.2,
          opacity: 0,
          textOpacity: 0,
        },
        stopIcon: {
          opacity: 0,
          textOpacity: 0,
        },
        destinationIcon: {
          url: busArrow,
          size: 0.2,
          opacity: 1,
          textOpacity: 0,
        },
        showArrows: true,
        arrowOptions: {
          size: 0.4,
          spacing: 100,
          fillColor: "#C6E3FF",
        },
      },
    ]);
    expect(getBusIconSpy).toHaveBeenCalled();
  });

  it("should construct routes properly when called with init as true", () => {
    const taskData: RouteTaskStopEventVehicleFeature = {
      totalRuns: 4,
      completedRuns: 0,
      coordinates: {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: [[-121.401843, 36.8224254]],
        },
      },
      events: {},
      stops: {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [-121.86589, 37.279026],
            },
            properties: {
              id: "c1ffd167-4a39-4645-b886-8b27fedf4135",
              templateId: "393088071",
              type: "SC",
              status: null,
              name: "SVCTE",
              description: "SVCTE",
              number: "1",
              performed: "Y",
              actualArrivalTime: null,
            },
            id: "c1ffd167-4a39-4645-b886-8b27fedf4135",
          },
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [-121.9854, 37.270306],
            },
            properties: {
              id: "0b3ecaf5-8fb3-40b3-b8fe-ac76dc2e5a53",
              templateId: "396457503",
              type: "ST",
              status: null,
              name: "4805 Westmont Ave",
              description: "4805 Westmont Ave",
              number: "2",
              performed: "N",
              actualArrivalTime: null,
            },
            id: "0b3ecaf5-8fb3-40b3-b8fe-ac76dc2e5a53",
          },
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [-122.000496, 37.292683],
            },
            properties: {
              id: "cd671e54-d576-49e8-8ca3-498acaf994c1",
              templateId: "396457505",
              type: "ST",
              status: null,
              name: "18900 Prospect Rd",
              description: "18900 Prospect Rd",
              number: "3",
              performed: "N",
              actualArrivalTime: null,
            },
            id: "cd671e54-d576-49e8-8ca3-498acaf994c1",
          },
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [-121.97656, 37.222637],
            },
            properties: {
              id: "347ef156-7705-4837-a0f0-d7f34d06535b",
              templateId: "396457501",
              type: "ST",
              status: null,
              name: "20 High School Ct",
              description: "20 High School Ct",
              number: "4",
              performed: "N",
              actualArrivalTime: null,
            },
            id: "347ef156-7705-4837-a0f0-d7f34d06535b",
          },
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [-121.97656, 37.222637],
            },
            properties: {
              id: "347ef156-7705-4837-a0f0-d7f34d06535b",
              templateId: "396457501",
              type: "DP",
              status: null,
              name: "20 High School Ct",
              description: "20 High School Ct",
              number: "5",
              performed: "N",
              actualArrivalTime: null,
            },
            id: "347ef156-7705-4837-a0f0-d7f34d06535b",
          },
        ],
      },
      vehicle: {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [-121.401843, 36.8224254],
        },
        properties: {
          id: "101962",
          type: "string",
          assetNumber: "101962",
          fleetNumber: "",
          heading: 311,
          speed: 0,
          speedUnit: "MPH",
          eventId: "426d15de-59b2-4185-aad9-4ffdf226e999",
          eventType: "string",
          eventStartTime: "2023-03-22T13:49:48.000Z",
          eventEndTime: "2023-03-22T13:49:48.000Z",
        },
        id: "101962",
      },
    };
    const getBusIconSpy = spyOn(service, "getBusIcon").and.returnValue(busArrow);
    const response = service.constructRoutes(taskData, [[1, 1]], true, false);

    expect(response).toEqual([
      {
        routeId: "1",
        routeColor: "#C6E3FF",
        routePathOpacity: 0.8,
        truckConfig: TrimbleMaps.Common.TruckConfig.CONVENTIONAL_SCHOOL_BUS,
        inclFerryDist: true,
        frameRoute: true,
        stops: [
          taskData.stops.features[0].geometry["coordinates"] as LngLatLike,
          ...taskData.stops.features
            .filter((stop, index) => index !== taskData.stops.features.length - 1)
            .map(stop => stop.geometry["coordinates"] as LngLatLike),
        ],
        showStops: false,
        showArrows: true,
        arrowOptions: {
          size: 0.4,
          spacing: 100,
          fillColor: "#C6E3FF",
        },
      },
      {
        routeId: "2",
        routeColor: "#C1C1C1",
        routePathOpacity: 0.8,
        truckConfig: TrimbleMaps.Common.TruckConfig.CONVENTIONAL_SCHOOL_BUS,
        inclFerryDist: true,
        frameRoute: false,
        stops: [],
        showStops: true,
        showArrows: true,
        arrowOptions: {
          size: 0.4,
          spacing: 100,
          fillColor: "#C6E3FF",
        },
        originIcon: {
          url: depotStart,
          size: 0.2,
          opacity: 1,
          textOpacity: 0,
        },
        stopIcon: {
          opacity: 0,
          textOpacity: 0,
        },
        destinationIcon: {
          opacity: 0,
          textOpacity: 0,
        },
      },
      {
        routeId: "3",
        routeColor: "#C1C1C1",
        routePathOpacity: 0.8,
        truckConfig: TrimbleMaps.Common.TruckConfig.CONVENTIONAL_SCHOOL_BUS,
        inclFerryDist: true,
        frameRoute: false,
        stops: [
          taskData.stops.features[taskData.stops.features.length - 1].geometry[
            "coordinates"
          ] as LngLatLike,
          taskData.stops.features[taskData.stops.features.length - 2].geometry[
            "coordinates"
          ] as LngLatLike,
        ],
        showStops: true,
        showArrows: true,
        arrowOptions: {
          size: 0.4,
          spacing: 100,
          fillColor: "#C6E3FF",
        },
        originIcon: {
          opacity: 0,
          textOpacity: 0,
        },
        stopIcon: {
          opacity: 0,
          textOpacity: 0,
        },
        destinationIcon: {
          url: depotStart,
          size: 0.2,
          opacity: 1,
          textOpacity: 0,
        },
      },
      {
        routeId: "4",
        routeColor: "#C6E3FF",
        routePathOpacity: 0.0,
        truckConfig: TrimbleMaps.Common.TruckConfig.CONVENTIONAL_SCHOOL_BUS,
        inclFerryDist: true,
        frameRoute: false,
        stops: [
          taskData.stops.features[0].geometry["coordinates"] as LngLatLike,
          ...taskData.stops.features
            .filter((stop, index) => index !== taskData.stops.features.length - 1)
            .map(stop => stop.geometry["coordinates"] as LngLatLike),
        ],
        showStops: true,
        originIcon: {
          opacity: 0,
          textOpacity: 0,
        },
        stopIcon: {
          size: 0.2,
          opacity: 1,
          textOpacity: 0.9,
        },
        destinationIcon: {
          url: destinationIcon,
          size: 0.2,
          opacity: 1,
          textOpacity: 0,
        },
        showArrows: false,
      },
      {
        routeId: "5",
        routeColor: "#082747",
        routePathOpacity: 0.8,
        truckConfig: TrimbleMaps.Common.TruckConfig.CONVENTIONAL_SCHOOL_BUS,
        inclFerryDist: true,
        frameRoute: true,
        stops: [[1, 1]],
        showStops: true,
        originIcon: {
          url: depotStart,
          size: 0.2,
          opacity: 0,
          textOpacity: 0,
        },
        stopIcon: {
          opacity: 0,
          textOpacity: 0,
        },
        destinationIcon: {
          url: busArrow,
          size: 0.2,
          opacity: 1,
          textOpacity: 0,
        },
        showArrows: true,
        arrowOptions: {
          size: 0.4,
          spacing: 100,
          fillColor: "#C6E3FF",
        },
      },
    ]);
    expect(getBusIconSpy).toHaveBeenCalled();
  });

  it("should construct routes properly when called with isComplete true", () => {
    const taskData: RouteTaskStopEventVehicleFeature = {
      totalRuns: 4,
      completedRuns: 0,
      coordinates: {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: [[-121.401843, 36.8224254]],
        },
      },
      events: {},
      stops: {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [-121.86589, 37.279026],
            },
            properties: {
              id: "c1ffd167-4a39-4645-b886-8b27fedf4135",
              templateId: "393088071",
              type: "DP",
              status: null,
              name: "SVCTE",
              description: "SVCTE",
              number: "0",
              performed: "Y",
              actualArrivalTime: null,
            },
            id: "c1ffd167-4a39-4645-b886-8b27fedf4135",
          },
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [-121.86589, 37.279026],
            },
            properties: {
              id: "c1ffd167-4a39-4645-b886-8b27fedf4135",
              templateId: "393088071",
              type: "SC",
              status: null,
              name: "SVCTE",
              description: "SVCTE",
              number: "1",
              performed: "Y",
              actualArrivalTime: null,
            },
            id: "c1ffd167-4a39-4645-b886-8b27fedf4135",
          },
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [-121.9854, 37.270306],
            },
            properties: {
              id: "0b3ecaf5-8fb3-40b3-b8fe-ac76dc2e5a53",
              templateId: "396457503",
              type: "ST",
              status: null,
              name: "4805 Westmont Ave",
              description: "4805 Westmont Ave",
              number: "2",
              performed: "N",
              actualArrivalTime: null,
            },
            id: "0b3ecaf5-8fb3-40b3-b8fe-ac76dc2e5a53",
          },
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [-122.000496, 37.292683],
            },
            properties: {
              id: "cd671e54-d576-49e8-8ca3-498acaf994c1",
              templateId: "396457505",
              type: "ST",
              status: null,
              name: "18900 Prospect Rd",
              description: "18900 Prospect Rd",
              number: "3",
              performed: "N",
              actualArrivalTime: null,
            },
            id: "cd671e54-d576-49e8-8ca3-498acaf994c1",
          },
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [-121.97656, 37.222637],
            },
            properties: {
              id: "347ef156-7705-4837-a0f0-d7f34d06535b",
              templateId: "396457501",
              type: "ST",
              status: null,
              name: "20 High School Ct",
              description: "20 High School Ct",
              number: "4",
              performed: "N",
              actualArrivalTime: null,
            },
            id: "347ef156-7705-4837-a0f0-d7f34d06535b",
          },
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [-121.97656, 37.222637],
            },
            properties: {
              id: "347ef156-7705-4837-a0f0-d7f34d06535b",
              templateId: "396457501",
              type: "DP",
              status: null,
              name: "20 High School Ct",
              description: "20 High School Ct",
              number: "5",
              performed: "N",
              actualArrivalTime: null,
            },
            id: "347ef156-7705-4837-a0f0-d7f34d06535b",
          },
        ],
      },
      vehicle: {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [-121.401843, 36.8224254],
        },
        properties: {
          id: "101962",
          type: "string",
          assetNumber: "101962",
          fleetNumber: "",
          heading: 311,
          speed: 0,
          speedUnit: "MPH",
          eventId: "426d15de-59b2-4185-aad9-4ffdf226e999",
          eventType: "string",
          eventStartTime: "2023-03-22T13:49:48.000Z",
          eventEndTime: "2023-03-22T13:49:48.000Z",
        },
        id: "101962",
      },
    };
    const getBusIconSpy = spyOn(service, "getBusIcon").and.returnValue(busArrow);
    const response = service.constructRoutes(taskData, [[1, 1]], false, true);

    expect(response).toEqual([
      {
        routeId: "1",
        routeColor: "#C6E3FF",
        routePathOpacity: 0.8,
        truckConfig: TrimbleMaps.Common.TruckConfig.CONVENTIONAL_SCHOOL_BUS,
        inclFerryDist: true,
        frameRoute: false,
        stops: taskData.stops.features
          .filter((stop, index) => index !== taskData.stops.features.length - 1)
          .map(stop => stop.geometry["coordinates"] as LngLatLike),
        showStops: false,
        showArrows: true,
        arrowOptions: {
          size: 0.4,
          spacing: 100,
          fillColor: "#C6E3FF",
        },
      },
      {
        routeId: "2",
        routeColor: "#C1C1C1",
        routePathOpacity: 0.8,
        truckConfig: TrimbleMaps.Common.TruckConfig.CONVENTIONAL_SCHOOL_BUS,
        inclFerryDist: true,
        frameRoute: false,
        stops: [
          taskData.stops.features[0].geometry["coordinates"] as LngLatLike,
          taskData.stops.features[1].geometry["coordinates"] as LngLatLike,
        ],
        showStops: true,
        showArrows: true,
        arrowOptions: {
          size: 0.4,
          spacing: 100,
          fillColor: "#C6E3FF",
        },
        originIcon: {
          url: depotStart,
          size: 0.2,
          opacity: 1,
          textOpacity: 0,
        },
        stopIcon: {
          opacity: 0,
          textOpacity: 0,
        },
        destinationIcon: {
          opacity: 0,
          textOpacity: 0,
        },
      },
      {
        routeId: "3",
        routeColor: "#C1C1C1",
        routePathOpacity: 0.8,
        truckConfig: TrimbleMaps.Common.TruckConfig.CONVENTIONAL_SCHOOL_BUS,
        inclFerryDist: true,
        frameRoute: false,
        stops: [
          taskData.stops.features[taskData.stops.features.length - 1].geometry[
            "coordinates"
          ] as LngLatLike,
          taskData.stops.features[taskData.stops.features.length - 2].geometry[
            "coordinates"
          ] as LngLatLike,
        ],
        showStops: true,
        showArrows: true,
        arrowOptions: {
          size: 0.4,
          spacing: 100,
          fillColor: "#C6E3FF",
        },
        originIcon: {
          opacity: 0,
          textOpacity: 0,
        },
        stopIcon: {
          opacity: 0,
          textOpacity: 0,
        },
        destinationIcon: {
          url: depotStart,
          size: 0.2,
          opacity: 1,
          textOpacity: 0,
        },
      },
      {
        routeId: "4",
        routeColor: "#C6E3FF",
        routePathOpacity: 0.0,
        truckConfig: TrimbleMaps.Common.TruckConfig.CONVENTIONAL_SCHOOL_BUS,
        inclFerryDist: true,
        frameRoute: false,
        stops: taskData.stops.features
          .filter((stop, index) => index !== taskData.stops.features.length - 1)
          .map(stop => stop.geometry["coordinates"] as LngLatLike),
        showStops: true,
        originIcon: {
          opacity: 0,
          textOpacity: 0,
        },
        stopIcon: {
          size: 0.2,
          opacity: 1,
          textOpacity: 0.9,
        },
        destinationIcon: {
          url: destinationIcon,
          size: 0.2,
          opacity: 1,
          textOpacity: 0,
        },
        showArrows: false,
      },
      {
        routeId: "5",
        routeColor: "#082747",
        routePathOpacity: 0.8,
        truckConfig: TrimbleMaps.Common.TruckConfig.CONVENTIONAL_SCHOOL_BUS,
        inclFerryDist: true,
        frameRoute: false,
        stops: [[1, 1]],
        showStops: true,
        originIcon: {
          url: depotStart,
          size: 0.2,
          opacity: 0,
          textOpacity: 0,
        },
        stopIcon: {
          opacity: 0,
          textOpacity: 0,
        },
        destinationIcon: {
          url: busArrow,
          size: 0.2,
          opacity: 0,
          textOpacity: 0,
        },
        showArrows: true,
        arrowOptions: {
          size: 0.4,
          spacing: 100,
          fillColor: "#C6E3FF",
        },
      },
    ]);
    expect(getBusIconSpy).toHaveBeenCalled();
  });
});

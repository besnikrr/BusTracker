import { differenceInMinutes, format, formatDistance } from "date-fns";

import { DATE_TIME_FORMAT } from "src/app/utilities/date.format";
import { getDirection } from "src/app/utilities/vehicleDirection";
import { VehicleEventRouteTaskNearbyStopDriver } from "src/first-student-api";

export const getPopUpContent = (vehicle: VehicleEventRouteTaskNearbyStopDriver) => {
  const UNASSIGNED = "Unassigned";
  const taskName = vehicle.task?.name ? `Route ${vehicle.task.name}` : UNASSIGNED.toUpperCase();
  const driverMiddleName = vehicle.task?.driver?.middleName
    ? `${vehicle.task?.driver?.middleName.charAt(0)}.`
    : "";
  const driverFullName = vehicle.task?.driver?.lastName
    ? vehicle.task?.driver?.lastName +
      ", " +
      vehicle.task?.driver?.firstName +
      " " +
      driverMiddleName
    : UNASSIGNED;
  let busConnected;
  const checkedTimes = "";
  let powerOff = "";
  let lastPingTime = "";
  let lastPingDate = "";
  let minAgo = 0;
  if (vehicle.eventEndTime) {
    lastPingTime = formatDistance(new Date(vehicle.eventEndTime), new Date(), {
      addSuffix: true,
    });
    lastPingDate = format(new Date(vehicle.eventEndTime), DATE_TIME_FORMAT);
    minAgo = differenceInMinutes(new Date(), new Date(vehicle.eventEndTime));
    busConnected = minAgo >= 3;
  }
  switch (true) {
    case vehicle.eventType === "reasons_poweroff" && busConnected:
      powerOff = "Bus turned off " + lastPingDate;
      break;
    case (!vehicle.eventType || vehicle.eventType !== "reasons_poweroff") && busConnected:
      powerOff = "Last connected " + lastPingDate;
      break;
    default:
      powerOff = "";
      break;
  }

  //   const emergencyAlert = `<div class="flex items-end bg-primary-red text-white text-sm p-2">
  //   <svg class="mr-2" width="24" height="24" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  //    <path d="M20.0429 21H3.95705C2.41902 21 1.45658 19.3364 2.22324 18.0031L10.2662 4.01533C11.0352 2.67792 12.9648 2.67791 13.7338 4.01532L21.7768 18.0031C22.5434 19.3364 21.581 21 20.0429 21Z" stroke="currentColor" stroke-linecap="round"/>
  //    <path d="M12 9V13" stroke="currentColor" stroke-linecap="round"/>
  //     <path d="M12 17.01L12.01 16.9989" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
  //   </svg>
  //   <span>Last ping was ${lastPingTime}</span>
  // </div>`;
  const nextStop = vehicle.task?.nextStop?.description
    ? `<span class="text-base capitalize">
  Next Stop: ${vehicle.task?.nextStop?.description}
</span>`
    : ``;
  const busOfflineAlert = `<div class="flex">
  <span class="flex flex-col text-primary-red font-semibold capitalize ">
  ${powerOff}
    </span>
    </div>`;
  const currentLocation = `<div class="flex">
    <svg class="mr-2" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <mask id="mask0_584_1001" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
    <rect width="20" height="20" fill="#D9D9D9"/>
    </mask>
    <g mask="url(#mask0_584_1001)">
    <path d="M10 19.125C9.764 19.125 9.559 19.0383 9.385 18.865C9.21167 18.691 9.125 18.486 9.125 18.25V17.438C7.43033 17.2433 5.96167 16.5243 4.719 15.281C3.47567 14.0383 2.75667 12.5697 2.562 10.875H1.75C1.514 10.875 1.309 10.7883 1.135 10.615C0.961667 10.441 0.875 10.236 0.875 10C0.875 9.764 0.961667 9.559 1.135 9.385C1.309 9.21167 1.514 9.125 1.75 9.125H2.562C2.75667 7.43033 3.47567 5.96167 4.719 4.719C5.96167 3.47567 7.43033 2.75667 9.125 2.562V1.75C9.125 1.514 9.21167 1.309 9.385 1.135C9.559 0.961667 9.764 0.875 10 0.875C10.236 0.875 10.441 0.961667 10.615 1.135C10.7883 1.309 10.875 1.514 10.875 1.75V2.562C12.5697 2.75667 14.0383 3.47567 15.281 4.719C16.5243 5.96167 17.2433 7.43033 17.438 9.125H18.25C18.486 9.125 18.691 9.21167 18.865 9.385C19.0383 9.559 19.125 9.764 19.125 10C19.125 10.236 19.0383 10.441 18.865 10.615C18.691 10.7883 18.486 10.875 18.25 10.875H17.438C17.2433 12.5697 16.5243 14.0383 15.281 15.281C14.0383 16.5243 12.5697 17.2433 10.875 17.438V18.25C10.875 18.486 10.7883 18.691 10.615 18.865C10.441 19.0383 10.236 19.125 10 19.125ZM10 15.729C11.5973 15.729 12.9513 15.1733 14.062 14.062C15.1733 12.9513 15.729 11.5973 15.729 10C15.729 8.40267 15.1733 7.04867 14.062 5.938C12.9513 4.82667 11.5973 4.271 10 4.271C8.40267 4.271 7.04867 4.82667 5.938 5.938C4.82667 7.04867 4.271 8.40267 4.271 10C4.271 11.5973 4.82667 12.9513 5.938 14.062C7.04867 15.1733 8.40267 15.729 10 15.729ZM10 13.396C9.06933 13.396 8.27067 13.0627 7.604 12.396C6.93733 11.7293 6.604 10.9307 6.604 10C6.604 9.06933 6.93733 8.27067 7.604 7.604C8.27067 6.93733 9.06933 6.604 10 6.604C10.9307 6.604 11.7293 6.93733 12.396 7.604C13.0627 8.27067 13.396 9.06933 13.396 10C13.396 10.9307 13.0627 11.7293 12.396 12.396C11.7293 13.0627 10.9307 13.396 10 13.396ZM10 11.646C10.4447 11.646 10.83 11.4827 11.156 11.156C11.4827 10.83 11.646 10.4447 11.646 10C11.646 9.55533 11.4827 9.17 11.156 8.844C10.83 8.51733 10.4447 8.354 10 8.354C9.55533 8.354 9.17 8.51733 8.844 8.844C8.51733 9.17 8.354 9.55533 8.354 10C8.354 10.4447 8.51733 10.83 8.844 11.156C9.17 11.4827 9.55533 11.646 10 11.646Z" fill="#414141"/>
    </g>
    </svg>
    <span class="flex flex-col text-sm text-light capitalize">
        ${getDirection(vehicle.heading)} ${vehicle.speed} ${vehicle.speedUnit}
        <span class="text-xs">${busOfflineAlert}</span>
    </span>
  </div>`;

  const lastPingAlert = `<div class="flex">
  <svg class="mr-2" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask id="mask0_584_615" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
        <rect width="20" height="20" fill="#D9D9D9"/>
        </mask>
        <g mask="url(#mask0_584_615)">
        <path d="M16.375 13.896L15.104 12.625C15.2987 12.2363 15.4513 11.823 15.562 11.385C15.6733 10.9477 15.729 10.486 15.729 10C15.729 8.40267 15.1733 7.04867 14.062 5.938C12.9513 4.82667 11.5973 4.271 10 4.271C9.5 4.271 9.03467 4.32667 8.604 4.438C8.17333 4.54867 7.76367 4.70133 7.375 4.896L6.104 3.625C6.56267 3.347 7.03833 3.118 7.531 2.938C8.02433 2.75733 8.55567 2.632 9.125 2.562V1.75C9.125 1.514 9.21167 1.309 9.385 1.135C9.559 0.961667 9.764 0.875 10 0.875C10.236 0.875 10.441 0.961667 10.615 1.135C10.7883 1.309 10.875 1.514 10.875 1.75V2.562C12.5697 2.75667 14.0383 3.47567 15.281 4.719C16.5243 5.96167 17.2433 7.43033 17.438 9.125H18.25C18.486 9.125 18.691 9.21167 18.865 9.385C19.0383 9.559 19.125 9.764 19.125 10C19.125 10.236 19.0383 10.441 18.865 10.615C18.691 10.7883 18.486 10.875 18.25 10.875H17.438C17.382 11.4303 17.2603 11.965 17.073 12.479C16.8857 12.993 16.653 13.4653 16.375 13.896ZM10 19.125C9.764 19.125 9.559 19.0383 9.385 18.865C9.21167 18.691 9.125 18.486 9.125 18.25V17.438C7.43033 17.2433 5.96167 16.5243 4.719 15.281C3.47567 14.0383 2.75667 12.5697 2.562 10.875H1.75C1.514 10.875 1.309 10.7883 1.135 10.615C0.961667 10.441 0.875 10.236 0.875 10C0.875 9.764 0.961667 9.559 1.135 9.385C1.309 9.21167 1.514 9.125 1.75 9.125H2.562C2.632 8.56967 2.75733 8.03833 2.938 7.531C3.118 7.02433 3.347 6.53467 3.625 6.062L1.75 4.188C1.58333 4.02133 1.50333 3.81633 1.51 3.573C1.51733 3.32967 1.60433 3.12467 1.771 2.958C1.93767 2.79133 2.14233 2.708 2.385 2.708C2.62833 2.708 2.83333 2.79133 3 2.958L17.042 17.021C17.2087 17.1877 17.292 17.389 17.292 17.625C17.292 17.861 17.2087 18.0623 17.042 18.229C16.8753 18.3957 16.6703 18.479 16.427 18.479C16.1837 18.479 15.9787 18.3957 15.812 18.229L13.917 16.354C13.4443 16.646 12.9547 16.882 12.448 17.062C11.9413 17.2427 11.417 17.368 10.875 17.438V18.25C10.875 18.486 10.7883 18.691 10.615 18.865C10.441 19.0383 10.236 19.125 10 19.125ZM10 15.729C10.4587 15.729 10.91 15.677 11.354 15.573C11.7987 15.469 12.2223 15.3057 12.625 15.083L4.917 7.375C4.69433 7.77767 4.531 8.19433 4.427 8.625C4.323 9.05567 4.271 9.514 4.271 10C4.271 11.5973 4.82667 12.9513 5.938 14.062C7.04867 15.1733 8.40267 15.729 10 15.729Z" fill="#DA291C"/>
        </g>
  </svg>
  <span class="flex flex-col text-primary-red font-semibold capitalize">
  ${busOfflineAlert}
    </span>
    </div>`;
  // eta indicator
  //   <div class="eta-status eta-ontime text-primary-blue">
  //   <span>${route.status}</span> : <span class="font-bold ">ETA ${
  //   route.eta
  // }</span>
  //   </div>
  return `<div class="flex w-full">
  <div class="flex flex-col  w-full">
  <div class="flex flex-col titleStatus  mb-3">
  <div class="flex justify-between">
  <span id="name" class="mb-3 routeName uppercase">
  ${taskName}
  </span>
  <svg id="closePopup" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <mask id="mask0_725_1606" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
    <rect width="24" height="24" fill="#D9D9D9"/>
    </mask>
    <g mask="url(#mask0_725_1606)">
    <path d="M12 13.4L7.10005 18.3C6.91672 18.4834 6.68338 18.575 6.40005 18.575C6.11672 18.575 5.88338 18.4834 5.70005 18.3C5.51672 18.1167 5.42505 17.8834 5.42505 17.6C5.42505 17.3167 5.51672 17.0834 5.70005 16.9L10.6 12L5.70005 7.10005C5.51672 6.91672 5.42505 6.68338 5.42505 6.40005C5.42505 6.11672 5.51672 5.88338 5.70005 5.70005C5.88338 5.51672 6.11672 5.42505 6.40005 5.42505C6.68338 5.42505 6.91672 5.51672 7.10005 5.70005L12 10.6L16.9 5.70005C17.0834 5.51672 17.3167 5.42505 17.6 5.42505C17.8834 5.42505 18.1167 5.51672 18.3 5.70005C18.4834 5.88338 18.575 6.11672 18.575 6.40005C18.575 6.68338 18.4834 6.91672 18.3 7.10005L13.4 12L18.3 16.9C18.4834 17.0834 18.575 17.3167 18.575 17.6C18.575 17.8834 18.4834 18.1167 18.3 18.3C18.1167 18.4834 17.8834 18.575 17.6 18.575C17.3167 18.575 17.0834 18.4834 16.9 18.3L12 13.4Z" fill="#414141"/>
    </g>
    </svg>
  </div>
  </div>
  <div class="flex justify-between mb-2 etaContainer">
    <div class="flex flex-col nextStopContainer">
      <span class="text-base font-semibold capitalize">
      ${vehicle.task?.runName ?? UNASSIGNED} ${vehicle.task?.runType ?? ""}
      </span>
      ${nextStop}
    </div>

  </div>
  <div class="flex flex-col gap-1">
    <div class="flex justify-between">
    <span class="flex text-sm text-light capitalize items-center">
    <svg class="mr-2" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <mask id="mask0_725_208" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
    <rect width="20" height="20" fill="#D9D9D9"/>
    </mask>
    <g mask="url(#mask0_725_208)">
    <path d="M10 9.97901C9.05533 9.97901 8.26366 9.65968 7.625 9.02101C6.98633 8.38168 6.667 7.59001 6.667 6.64601C6.667 5.70134 6.98633 4.90968 7.625 4.27101C8.26366 3.63168 9.05533 3.31201 10 3.31201C10.9447 3.31201 11.7363 3.63168 12.375 4.27101C13.0137 4.90968 13.333 5.70134 13.333 6.64601C13.333 7.59001 13.0137 8.38168 12.375 9.02101C11.7363 9.65968 10.9447 9.97901 10 9.97901ZM14.979 16.667H5.021C4.535 16.667 4.12166 16.4967 3.781 16.156C3.441 15.816 3.271 15.403 3.271 14.917V14.271C3.271 13.785 3.396 13.3473 3.646 12.958C3.896 12.5693 4.22233 12.2777 4.625 12.083C5.47233 11.6803 6.35066 11.3713 7.26 11.156C8.17 10.9407 9.08333 10.833 10 10.833C10.9167 10.833 11.8333 10.9407 12.75 11.156C13.6667 11.3713 14.5417 11.6803 15.375 12.083C15.7777 12.2777 16.104 12.5693 16.354 12.958C16.604 13.3473 16.729 13.785 16.729 14.271V14.917C16.729 15.403 16.559 15.816 16.219 16.156C15.8783 16.4967 15.465 16.667 14.979 16.667ZM5.021 14.917H14.979V14.271C14.979 14.1183 14.9443 13.9863 14.875 13.875C14.8057 13.7637 14.7153 13.6943 14.604 13.667C13.882 13.3197 13.125 13.0523 12.333 12.865C11.5417 12.677 10.764 12.583 10 12.583C9.236 12.583 8.45833 12.6803 7.667 12.875C6.875 13.0697 6.118 13.3337 5.396 13.667C5.28466 13.7223 5.19433 13.7987 5.125 13.896C5.05566 13.9933 5.021 14.1183 5.021 14.271V14.917ZM10 8.22901C10.4587 8.22901 10.837 8.07968 11.135 7.78101C11.4337 7.48235 11.583 7.10401 11.583 6.64601C11.583 6.18735 11.4337 5.80868 11.135 5.51001C10.837 5.21135 10.4587 5.06201 10 5.06201C9.54133 5.06201 9.163 5.21135 8.865 5.51001C8.56633 5.80868 8.417 6.18735 8.417 6.64601C8.417 7.10401 8.56633 7.48235 8.865 7.78101C9.163 8.07968 9.54133 8.22901 10 8.22901Z" fill="#414141"/>
    </g>
    </svg>
    <p>
    
    ${driverFullName}
    </p>
    </span>
    </div>
    <span class="flex text-sm text-light capitalize items-center">
      <svg class="mr-2" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6.66663" y="11.6667" width="6.66667" height="3.33333" fill="#414141"/>
      <rect x="7.5" y="4.16666" width="5" height="1.66667" fill="#414141"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M7.66663 2.91666H12.3333C14.5089 2.91666 16.3429 4.37935 16.9056 6.37499L3.09436 6.37499C3.657 4.37935 5.491 2.91666 7.66663 2.91666ZM2.91685 7.61952L2.91663 7.66666V9.58332L17.0833 9.58332V7.66666L17.0831 7.61951C17.0558 7.62312 17.0281 7.62499 16.9999 7.62499L2.99988 7.62499C2.97173 7.62499 2.94402 7.62313 2.91685 7.61952ZM18.3333 9.58332V7.66666C18.3333 4.35296 15.647 1.66666 12.3333 1.66666H7.66663C4.35292 1.66666 1.66663 4.35296 1.66663 7.66666V9.58332V10.8333V14.6667C1.66663 15.664 2.39661 16.4908 3.35142 16.642C3.33942 16.7039 3.33313 16.7679 3.33313 16.8333V17.3333C3.33313 17.8856 3.78085 18.3333 4.33313 18.3333H6.4998C7.05208 18.3333 7.4998 17.8856 7.4998 17.3333V16.8333C7.4998 16.7765 7.49506 16.7209 7.48597 16.6667H12.5137C12.5046 16.7209 12.4999 16.7765 12.4999 16.8333V17.3333C12.4999 17.8856 12.9476 18.3333 13.4999 18.3333H15.6665C16.2188 18.3333 16.6665 17.8856 16.6665 17.3333V16.8333C16.6665 16.7679 16.6603 16.7039 16.6483 16.642C17.6032 16.4909 18.3333 15.6641 18.3333 14.6667V10.8333V9.58332ZM17.0833 10.8333L2.91663 10.8333V14.6667C2.91663 15.0809 3.25241 15.4167 3.66663 15.4167H16.3333C16.7475 15.4167 17.0833 15.0809 17.0833 14.6667V10.8333Z" fill="#414141"/>
      <circle cx="4.99996" cy="14.1667" r="0.833333" fill="#414141"/>
      <circle cx="15" cy="14.1667" r="0.833333" fill="#414141"/>
      <circle cx="14.1667" cy="5" r="0.833333" fill="#414141"/>
      <circle cx="5.83333" cy="5" r="0.833333" fill="#414141"/>
      </svg>

      ${vehicle.id} ${vehicle.fleetNumber ? `(${vehicle.fleetNumber})` : ""}
    </span>
    ${checkedTimes ? lastPingAlert : currentLocation}

    <span class="w-full mt-3">
    ${
      vehicle.task?.id
        ? `<button
    type="button"
    class="w-full bg-secondary-blue text-white button-fill-no-icon"
    id="viewRouteDetails"
    >
    View Details
  </button>`
        : ""
    }
    </span>
  </div>
</div>
  </div>`;
};

export const getLoading = () => {
  return `
  <center>
  <div class=" mt-8 mb-8" style="display: inline-block; ">
    <div style="display: block; width: 64px; height: 64px; margin: auto; border-radius: 50%; border: 6px solid #cef; border-color: rgb(65, 132, 165) transparent rgb(66, 132, 165) transparent; animation: lds-dual-ring 1s linear infinite;">
    </div>
    <style>
      @keyframes lds-dual-ring {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
    </style>
  </div>
  </center>`;
};

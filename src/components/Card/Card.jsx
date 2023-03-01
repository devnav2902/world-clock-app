import { XMarkIcon } from "@heroicons/react/20/solid";
import React from "react";
import { getCurrentTime, getTimeDiff } from "../../utils/utils";

const Card = ({ cityName, shortLabel, timeZone, localTime, removeAClock }) => {
  // 01, GMT+9 => slice(4) => GMT+9
  const timeZoneAbbreviation = new Date()
    .toLocaleDateString("en-US", {
      day: "2-digit",
      timeZoneName: "short",
      timeZone,
    })
    .slice(4);

  const timeDiff = getTimeDiff(
    new Date().toLocaleString("en-US", {
      timeZone: "Asia/Ho_Chi_Minh",
    }),
    new Date().toLocaleString("en-US", { timeZone })
  );

  return (
    <div className="group border border-black text-center p-4 flex flex-col cursor-pointer relative">
      <div className="group-hover:backdrop-blur-sm bg-white/60 group-hover:visible opacity-100 invisible absolute w-full h-full top-0 left-0 transition duration-300">
        <XMarkIcon
          onClick={() => removeAClock(timeZone)}
          className="hover:text-black/80 hover:scale-150 group-hover:scale-90 scale-50 w-9 h-9 absolute top-2 right-2 transition duration-300 ease-in-out text-black/60"
        />
      </div>
      <div className="min-h-[58px]">
        <div className="text-xl font-medium">{cityName}</div>
        {shortLabel && (
          <p className="text-opacity-80 text-black truncate">{shortLabel}</p>
        )}
      </div>
      <time className="pt-2 pb-6 font-medium text-3xl block mt-auto">
        {/* not correct */}
        {getCurrentTime(timeZone)}
      </time>
      <div className="uppercase">{timeZoneAbbreviation}</div>
      {/* bug, haven't check minute */}
      <div>{`${Math.abs(timeDiff)} ${
        timeDiff === 1 ? "hour" : timeDiff === 0 ? "" : "hours"
      } ${timeDiff > 0 ? "ahead " : timeDiff === 0 ? "same time " : "behind"} ${
        localTime.cityName
      }`}</div>
    </div>
  );
};

export default Card;

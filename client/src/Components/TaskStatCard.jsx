import React from "react";


function TaskStatCard({
  iconBgColor,
  iconSrc,
  title,
  count,
  countSuffix = "",
  hasIcon = false,
}) {
  return (
    <div className="flex flex-col items-start pt-5 pr-11 pb-10 pl-5 max-w-full bg-gray-200 rounded-2xl min-h-[196px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] w-[268px] max-md:pr-5 mb-4">
      <div className="flex flex-col justify-center">
        <div className="flex flex-col justify-center">
          <div
            className={`flex gap-2.5 items-center p-3 ${iconBgColor} rounded-3xl h-[46px] min-h-[46px] w-[46px]`}
          >
            {iconSrc ? (
              <img
                src={iconSrc}
                className="object-contain flex-1 shrink w-full aspect-square basis-0"
                alt={title}
              />
            ) : hasIcon ? (
              <div className="flex self-stretch my-auto min-h-[22px] w-[22px]" />
            ) : null}
          </div>
          <div className="mt-5 font-medium">
            <div className="text-sm text-neutral-500">{title}</div>
            <div className="mt-2.5 text-3xl tracking-wide text-zinc-950">
              {count}
              {countSuffix && (
                <span className="text-base tracking-[0.64px]">
                  {countSuffix}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskStatCard;

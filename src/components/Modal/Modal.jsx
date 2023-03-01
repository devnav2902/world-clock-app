import { Dialog, Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

const Modal = ({
  isOpenModal,
  closeModal,
  //
  worldClockArr,
  handleAddWorldClock,
  //
  citiesAndTimeZone,
}) => {
  const [citiesWithUnavailableField, setCitiesWithUnavailableField] = useState([
    ...citiesAndTimeZone,
  ]);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm({
    defaultValues: {
      selectedCity: {
        cityName: "Please select a city",
        timeZone: "",
        unavailable: true,
      },
      shortLabel: "",
    },
  });

  useEffect(
    function addFieldForExistedCity() {
      // [{cityName, timeZone, unavailable}, ...]
      const data = citiesAndTimeZone.map((city) => {
        const exist = worldClockArr.some(
          ({ timeZone }) => city.timeZone === timeZone
        );

        if (exist) return { ...city, unavailable: true };
        return city;
      });

      setCitiesWithUnavailableField(data);
    },
    [citiesAndTimeZone, worldClockArr]
  );

  function addValueToWorldClock() {
    handleSubmit((data) => {
      setLoading(true);

      fetch(
        `http://worldtimeapi.org/api/timezone/${data.selectedCity.timeZone}`
      )
        .then((response) => response.json())
        .then((result) => {
          const { timezone: timeZone, datetime: currentTime } = result;

          handleAddWorldClock({
            timeZone,
            currentTime,
            cityName: data.selectedCity.cityName,
            shortLabel: data.shortLabel,
          });
        })
        .then(() => {
          setLoading(false);
          closeModal();
          reset();
        });
    })();
  }

  return (
    <Transition appear show={isOpenModal}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => (loading ? undefined : closeModal())}
      >
        <Transition.Child
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Add a city to the world clock
                </Dialog.Title>
                <div className="mt-4">
                  <div>
                    {
                      <Controller
                        name="selectedCity"
                        control={control}
                        rules={{
                          validate: (data) =>
                            !data.unavailable || "This field is required!",
                        }}
                        render={({ field: { onChange, value } }) => (
                          <Listbox value={value} onChange={onChange}>
                            <div className="relative mt-1">
                              <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                                <span className="block truncate">
                                  {value?.cityName}
                                </span>
                                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                  <ChevronUpDownIcon
                                    className="h-5 w-5 text-gray-400"
                                    aria-hidden="true"
                                  />
                                </span>
                              </Listbox.Button>
                              <Transition
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                              >
                                <Listbox.Options className="z-10 absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                  {citiesWithUnavailableField.map(
                                    (city, idx) => (
                                      <Listbox.Option
                                        key={idx}
                                        className={({ active }) =>
                                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                            active
                                              ? "bg-amber-100 text-amber-900"
                                              : "text-gray-900"
                                          }`
                                        }
                                        value={city}
                                        disabled={!!city.unavailable}
                                      >
                                        {({ selected, disabled }) => {
                                          return (
                                            <>
                                              <span
                                                className={`block truncate ${
                                                  selected
                                                    ? "font-medium"
                                                    : "font-normal"
                                                } ${
                                                  disabled ? "opacity-60" : ""
                                                }`}
                                              >
                                                {city.cityName}
                                              </span>
                                              {selected ? (
                                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                                  <CheckIcon
                                                    className="h-5 w-5"
                                                    aria-hidden="true"
                                                  />
                                                </span>
                                              ) : null}
                                            </>
                                          );
                                        }}
                                      </Listbox.Option>
                                    )
                                  )}
                                </Listbox.Options>
                              </Transition>
                            </div>
                          </Listbox>
                        )}
                      />
                    }
                    {errors.selectedCity && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-500 max-w-[250px]">
                        {errors.selectedCity.message}
                      </p>
                    )}
                  </div>

                  <div className="mt-5">
                    <input
                      type="text"
                      className="shadow-md bg-gray-50 text-gray-900 text-sm rounded-lg focus:border-orange-300 block w-full p-2.5 placeholder-gray-400 focus:outline-none"
                      placeholder="Short label"
                      {...register("shortLabel", {
                        maxLength: {
                          value: 20,
                          message:
                            "Short label should be less than or equal to 20 characters!",
                        },
                      })}
                    />
                    {errors.shortLabel && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-500 max-w-[250px]">
                        {errors.shortLabel.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-4 text-right">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={addValueToWorldClock}
                    disabled={loading}
                  >
                    {loading && (
                      <span className="animate-spin h-5 w-5 mr-3 rounded-full border-4 border-solid border-r-transparent border-current"></span>
                    )}
                    Create
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;

"use client";

import { useEffect, useState } from "react";
import CollectionList from "@/components/collections/CollectionList";
import CollectionFilters from "@/components/collections/CollectionFilters";
import { useCollections } from "@/hooks/useCollections";
import { Spinner } from "@/components/Spinner";
import Image from "next/image";
import filterLogo from "/public/icons/filter-icon.svg"; // İkonun yolu
import { useCollectionsContext } from "@/contexts/CollectionsProvider";

export default function CollectionsPage() {
  const { totalCount, loading } = useCollections();

  const { setFilterSwitch, filterSwitch } = useCollectionsContext();
  const { selectedOptionSort, setSelectedOptionSort } = useCollectionsContext();

  const [isOpen, setIsOpen] = useState(false);
  const options = [
    { label: "Ascending", value: "asc" },
    { label: "Descending", value: "dsc" },
  ];
  return (
    <div
      id="collection-section"
      className="w-full min-h-screen bg-[#ebebe6] flex"
    >
      <div className={`mx-auto lg:px-[13vw] flex flex-row w-full`}>
        <div
          className={`border border-r-black h-screen overflow-y-auto content-center
    p-0 lg:p-4
    fixed lg:relative
    z-[1]
    bg-white lg:bg-inherit
    ${
      filterSwitch
        ? "opacity-100 visible translate-x-0 w-full lg:w-1/4"
        : "opacity-0 invisible translate-x-[-100%] w-0"
    }
    transition-all duration-300 ease-in-out`}
        >
          <CollectionFilters />
        </div>

        <div className="flex flex-col pt-20 w-full">
          <div className="w-full px-8">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <div className="text-2xl font-bold p-2 bg-[#bcbcb8] rounded-[6px]">
                  FELS
                </div>
              </div>
              <div className="border border-b-black p-2 mx-4 flex justify-between w-full h-[46px]">
                <div> </div>
                <div className="text-xl font-semibold ">
                  {loading ? (
                    <div className="flex items-center px-2">
                      <Spinner />
                    </div>
                  ) : (
                    totalCount
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row md:justify-between mb-4">
              <div className="flex flex-col justify-between gap-4 md:gap-0">
                <h1 className="text-4xl text-center md:text-start">
                  COLLECTIONS
                </h1>
              </div>
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => setFilterSwitch(!filterSwitch)}
                className=" text-sm text-white rounded-full hover:opacity-90 whitespace-nowrap flex items-center justify-center"
              >
                <Image
                  src={filterLogo}
                  className="relative mr-2"
                  alt="Filter Logo"
                  width={25}
                  height={25}
                />
              </button>
              <div className="flex flex-col items-end md:items-normal md:gap-4 justify-end">
                <div className="flex flex-wrap gap-4 w-full md:w-auto md:justify-end">
                  <div className="flex justify-end">
                    <div className="relative w-auto">
                      <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="w-full md:w-auto border border-black rounded-[6px] p-2 pr-10 pl-5 bg-transparent hover:cursor-pointer flex items-center text-sm justify-between min-w-[200px]"
                      >
                        <span>
                          {options.find(
                            (option) => option.value === selectedOptionSort
                          )?.label || " FILTER TYPE: SELECT"}
                        </span>

                        <span className="absolute right-3">▼</span>
                      </button>

                      {isOpen && (
                        <div className="absolute text-sm top-full left-0 right-0 mt-1 border border-black rounded-[6px] bg-[#2f2f2e] text-white overflow-hidden z-50">
                          {options.map((option) => (
                            <div
                              key={option.value}
                              className="px-4 py-2 hover:bg-black/30 cursor-pointer"
                              onClick={() => {
                                setSelectedOptionSort(option.value);
                                setIsOpen(false);
                              }}
                            >
                              {option.label}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full px-8 w-3/4">
            <CollectionList />
          </div>
        </div>
      </div>
    </div>
  );
}

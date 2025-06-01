import { useState, useEffect } from "react";
import { getNftCollectionTraits } from "@/services/api";
import { useCollectionsContext } from "@/contexts/CollectionsProvider";
import { Search } from "lucide-react";
import { Spinner } from "../Spinner";
import Image from "next/image";
import filterLogo from "/public/icons/filter-icon.svg"; // İkonun yolu

export default function CollectionFilters() {
  const [traits, setTraits] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openCategories, setOpenCategories] = useState<{
    [key: string]: boolean;
  }>({});
  const [searchCategory, setCategorySearch] = useState("");
  const [searchValues, setSearchValues] = useState<{ [key: string]: string }>(
    {}
  ); // Kategoriye özel arama

  const { selectedTraits, setSelectedTraits, setFilterSwitch, filterSwitch } =
    useCollectionsContext();

  useEffect(() => {
    const fetchTraits = async () => {
      try {
        const data = await getNftCollectionTraits();
        setTraits(data.traits);
      } catch (err) {
        console.error("Error fetching NFT collection traits:", err);
        setError("Failed to fetch NFT collection traits");
      } finally {
        setLoading(false);
      }
    };
    fetchTraits();
  }, []);

  const toggleCategory = (category: string) => {
    setOpenCategories((prev) => ({ ...prev, [category]: !prev[category] }));
  };

  const handleCheckboxChange = (category: string, value: string) => {
    // @ts-ignore
    setSelectedTraits((prev) => {
      const exists = prev.some(
        (trait: { trait_type: string; value: string }) =>
          trait.trait_type === category && trait.value === value
      );
      return exists
        ? prev.filter(
            (trait: { trait_type: string; value: string }) =>
              !(trait.trait_type === category && trait.value === value)
          )
        : [...prev, { trait_type: category, value }];
    });
  };

  if (loading)
    return (
      <div className="flex items-center justify-center">
        <Spinner />
      </div>
    );
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="rounded-lg h-screen p-4 overflow-y-auto content-center">
      <button
        onClick={() => setFilterSwitch(!filterSwitch)}
        className="lg:hidden place-self-end text-sm text-white rounded-full hover:opacity-90 whitespace-nowrap flex items-center justify-center"
      >
        <Image
          src={filterLogo}
          className="relative mr-2"
          alt="Filter Logo"
          width={25}
          height={25}
        />
      </button>
      <h2 className="font-bold text-lg">FILTER</h2>
      <div className="w-full h-px bg-black/20 my-2" />
      <div className="flex items-center gap-2 text-gray-600 mb-4 relative">
        {!searchCategory && (
          <Search className="absolute left-0 top-1/2 transform -translate-y-1/2 text-black w-4 h-4" />
        )}

        <input
          type="text"
          placeholder="  Search"
          className="border-none bg-transparent focus:outline-none text-sm"
          value={searchCategory}
          onChange={(e) => setCategorySearch(e.target.value)}
        />
      </div>
      {traits &&
        Object.keys(traits).map((category) => {
          if (!category.toLowerCase().includes(searchCategory.toLowerCase()))
            return null;

          return (
            <div key={category} className="mb-4">
              <div
                className="flex justify-between items-center cursor-pointer font-semibold"
                onClick={() => toggleCategory(category)}
              >
                <div className="flex justify-between w-full">
                  <div className="flex">
                    <Image
                      src={`/icons/${category.toLowerCase()}-icon.svg`}
                      alt="Stake"
                      width={16}
                      height={16}
                    />
                    <div className="flex flex-row">
                      <p className="ml-1 font-normal">
                        {category.toUpperCase()}
                      </p>
                      <p>({traits[category].count})</p>
                    </div>
                  </div>
                  <span>{openCategories[category] ? "-" : "+"}</span>
                </div>
              </div>
              {openCategories[category] && (
                <div className="ml-1 mt-1">
                  {/* Kategori altındaki değerleri filtrelemek için input */}

                  <input
                    type="text"
                    placeholder={`Search in ${category}...`}
                    className="border border-gray-300 bg-transparent rounded-md p-1 mt-2 mb-4 text-sm w-full"
                    value={searchValues[category] || ""}
                    onChange={(e) =>
                      setSearchValues((prev) => ({
                        ...prev,
                        [category]: e.target.value,
                      }))
                    }
                  />

                  <div className="custom-scrollbar h-[150px] overflow-y-scroll overflow-x-scroll scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200">
                    {/* Filtrelenmiş trait değerlerini göster */}
                    {traits[category].values
                      .filter((item: string) =>
                        item
                          .toLowerCase()
                          .includes(
                            (searchValues[category] || "").toLowerCase()
                          )
                      )
                      .map((item: string) => (
                        <div key={item} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id={item}
                            className="cursor-pointer"
                            onChange={() =>
                              handleCheckboxChange(category, item)
                            }
                            checked={selectedTraits.some(
                              (trait) =>
                                trait.trait_type === category &&
                                trait.value === item
                            )}
                          />
                          <label
                            htmlFor={item}
                            className="cursor-pointer text-sm"
                          >
                            {item}
                          </label>
                        </div>
                      ))}
                  </div>
                </div>
              )}
              <div className="w-full h-px bg-black/20 my-2" />
            </div>
          );
        })}
      {/* <div className="mt-4">
        <h3 className="font-semibold">Selected Traits:</h3>
        <pre className="text-sm bg-gray-200 p-2 rounded">
          {JSON.stringify(selectedTraits, null, 2)}
        </pre>
      </div> */}
    </div>
  );
}

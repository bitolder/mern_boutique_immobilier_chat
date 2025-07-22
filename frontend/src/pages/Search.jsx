import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ListingItem from "../components/ListingItem";
import { axiosInstance } from "../lib/axios";
function Search() {
  const [loading, setLoading] = useState(false);
  const [listings, setListing] = useState([]);
  const [sideBarData, setSideBarData] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "created_at",
    order: "desc",
  });
  const [showMore, setShowMore] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const typeFromUrl = urlParams.get("type");
    const parkingFromUrl = urlParams.get("parking");
    const furnishedFromUrl = urlParams.get("furnished");
    const offerFromUrl = urlParams.get("offer");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      sortFromUrl ||
      orderFromUrl ||
      furnishedFromUrl ||
      offerFromUrl
    ) {
      setSideBarData({
        searchTerm: searchTermFromUrl || "",
        type: typeFromUrl || "all",
        parking: parkingFromUrl === "true" ? true : false,
        furnished: furnishedFromUrl === "true" ? true : false,
        offer: offerFromUrl === "true" ? true : false,
        sort: sortFromUrl || "created_at",
        order: orderFromUrl || "desc",
      });
    }
    const fetchListing = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();

      const res = await axiosInstance.get(`/listing/get?${searchQuery}`);
      const data = res.data;
      if (data.length > 8) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
      setListing(data);
      setLoading(false);
    };
    fetchListing();
  }, [location.search]);
  const handleChange = (e) => {
    if (
      e.target.id === "all" ||
      e.target.id === "rent" ||
      e.target.id === "sale"
    ) {
      setSideBarData({ ...sideBarData, type: e.target.id });
    }
    if (e.target.id === "searchTerm") {
      setSideBarData({ ...sideBarData, searchTerm: e.target.value });
    }
    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setSideBarData({
        ...sideBarData,
        [e.target.id]:
          e.target.checked || e.target.checked === "true" ? true : false,
      });
    }
    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "created_at";
      const order = e.target.value.split("_")[1] || "desc";
      setSideBarData({ ...sideBarData, sort, order });
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sideBarData.searchTerm);
    urlParams.set("type", sideBarData.type);
    urlParams.set("parking", sideBarData.parking);
    urlParams.set("furnished", sideBarData.furnished);
    urlParams.set("offer", sideBarData.offer);
    urlParams.set("sort", sideBarData.sort);
    urlParams.set("order", sideBarData.order);
    const searchQuery = urlParams.toString();

    navigate(`/search?${searchQuery}`);
  };
  const onShowMoreClick = async () => {
    const numbersOfListings = listings.length;
    const startIndex = numbersOfListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();

    const res = await axiosInstance.get(`/listing/get?${searchQuery}`);
    const data = res.data;
    if (data.length < 9) {
      setShowMore(false);
    }
    setListing([...listings, ...data]);
  };
  return (
    <div className="flex flex-col md:flex-row md:min-h-screen">
      <div className="p-7 border-b-2 md:border-r-2">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex items-center gap-2 ">
            <label className="whitespace-nowrap font-semibold">
              Search Term:
            </label>
            <input
              className="w-full p-3 rounded-lg border  bg-white text-black border-slate-400 "
              type="text"
              placeholder="Search..."
              id="searchTerm"
              value={sideBarData.searchTerm}
              onChange={handleChange}
            />
          </div>

          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Type:</label>
            <div className="flex gap-2 ">
              <input
                type="checkbox"
                id="all"
                className="checkbox border-slate-400 [--chkbg:theme(colors.white)] [--chkfg:black] checked:border-white"
                onChange={handleChange}
                checked={sideBarData.type === "all"}
              />
              <span>Rent & Sale</span>
            </div>

            <div className="flex gap-2 ">
              <input
                type="checkbox"
                id="rent"
                className="checkbox border-slate-400 [--chkbg:theme(colors.white)] [--chkfg:black] checked:border-white"
                onChange={handleChange}
                checked={sideBarData.type === "rent"}
              />
              <span>Rent </span>
            </div>

            <div className="flex gap-2 ">
              <input
                type="checkbox"
                id="sale"
                className="checkbox border-slate-400 [--chkbg:theme(colors.white)] [--chkfg:black] checked:border-white"
                onChange={handleChange}
                checked={sideBarData.type === "sale"}
              />
              <span>Sale</span>
            </div>

            <div className="flex gap-2 ">
              <input
                type="checkbox"
                id="offer"
                className="checkbox border-slate-400 [--chkbg:theme(colors.white)] [--chkfg:black] checked:border-white"
                onChange={handleChange}
                checked={sideBarData.offer}
              />
              <span>Offer</span>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Amenities:</label>
            <div className="flex gap-2 ">
              <input
                type="checkbox"
                id="parking"
                className="checkbox border-slate-400 [--chkbg:theme(colors.white)] [--chkfg:black] checked:border-white"
                onChange={handleChange}
                checked={sideBarData.parking}
              />
              <span>Parking</span>
            </div>

            <div className="flex gap-2 ">
              <input
                type="checkbox"
                id="furnished"
                className="checkbox border-slate-400 [--chkbg:theme(colors.white)] [--chkfg:black] checked:border-white"
                onChange={handleChange}
                checked={sideBarData.furnished}
              />
              <span>Furnished</span>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold ">Sort:</label>
            <select
              className="border rounded-lg p-3  bg-white text-black border-slate-400"
              id="sort_order"
              onChange={handleChange}
              defaultValue={"created_at_desc"}
            >
              <option value={"regularPrice_desc"}>Price high to low</option>
              <option value={"regularPrice_asc"}>Price low to high</option>
              <option value={"createdAt_desc"}>Latest</option>
              <option value={"createdAt_asc"}>Oldest</option>
            </select>
          </div>
          <button className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95">
            Search
          </button>
        </form>
      </div>

      <div className="flex-1">
        <h1 className="font-semibold text-3xl text-slate-700 p-3 border-b-2 mt-5">
          Listing results:
        </h1>

        <div className=" p-7 flex flex-wrap gap-4">
          {!loading && listings.length === 0 && (
            <p className="text-xl text-slate-700"> No listings found</p>
          )}
          {loading && (
            <p className="text-xl text-center text-slate-700 w-full">
              {" "}
              Loading...
            </p>
          )}
          {!loading &&
            listings &&
            listings.map((listing) => (
              <ListingItem key={listing._id} listing={listing} />
            ))}
        </div>
        {showMore && (
          <button
            className="text-green-700 hover:underline p-7 w-full text-center"
            onClick={onShowMoreClick}
          >
            Show more
          </button>
        )}
      </div>
    </div>
  );
}

export default Search;

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css/bundle";
import ListingItem from "../components/ListingItem";
import { axiosInstance } from "../lib/axios";

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  SwiperCore.use([Navigation]);
  // console.log(offerListings);
  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        // const res = await fetch("/api/listing/get?offer=true&limit=3");
        const res = await axiosInstance.get("/listing/get?offer=true&limit=3");
        const data = await res.data;
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };
    const fetchRentListings = async () => {
      try {
        // const res = await fetch("/api/listing/get?type=rent&limit=3");
        const res = await axiosInstance.get("/listing/get?type=rent&limit=3");
        const data = await res.data;
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        // const res = await fetch("/api/listing/get?type=sale&limit=3");
        const res = await axiosInstance.get("/listing/get?type=sale&limit=3");
        const data = await res.data;
        setSaleListings(data);
      } catch (error) {
        log(error);
      }
    };
    fetchOfferListings();
  }, []);
  return (
    <div className="bg-white">
      <div className="flex flex-col mx-auto p-28 px-3 gap-6  max-w-6xl ">
        {/*top*/}
        <h1 className="text-3xl lg:text-6xl font-bold text-slate-700">
          Find yout next <span className="text-slate-500">perfect</span>
          <br /> place with ease
        </h1>
        <div>
          <p className="text-gray-400 text-xs sm:text-sm">
            Immo Estate will help you find your home fast, easy and comfortable.
            Our expert support are always available.
          </p>
        </div>
        <Link
          className="text-blue-700 hover:underline text-xs sm:text-sm"
          to="/search"
        >
          Let's Start now...
        </Link>
      </div>

      {/*swiper*/}
      <Swiper navigation>
        {offerListings &&
          offerListings.length > 0 &&
          offerListings.map((listing) => (
            <SwiperSlide key={listing._id}>
              <div
                style={{
                  background: `url(${listing.imagesUrls[0]}) center no-repeat`,
                  backgroundSize: "cover",
                }}
                className="h-[500px]"
              ></div>
            </SwiperSlide>
          ))}
      </Swiper>
      <div className="flex flex-col p-3  gap-8 mx-auto my-10  max-w-6xl ">
        {offerListings && offerListings.length > 0 && (
          <div>
            <div>
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent offers
              </h2>
              <Link
                className="text-sm text-blue-800 hover:underline"
                to={"/search?offer=true"}
              >
                Show more offers
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {offerListings.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
            </div>
          </div>
        )}

        {rentListings && rentListings.length > 0 && (
          <div>
            <div>
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent rents
              </h2>
              <Link
                className="text-sm text-blue-800 hover:underline"
                to={"/search?type=rent"}
              >
                Show more rents
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {rentListings.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
            </div>
          </div>
        )}

        {saleListings && saleListings.length > 0 && (
          <div>
            <div>
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent sale
              </h2>
              <Link
                className="text-sm text-blue-800 hover:underline"
                to={"/search?type=rent"}
              >
                Show more sale
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {saleListings.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
//

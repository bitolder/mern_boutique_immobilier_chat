import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";

export default function ListingItem({ listing }) {
  return (
    <div className=" bg-white shadow-md hover:shadow-lg transition-shadow  overflow-hidden rounded-lg w-full sm:w-[330px] ">
      <Link to={`/listing/${listing._id}`}>
        <img
          src={listing.imagesUrls[0]}
          alt="listing cover"
          className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 translate-scale duration-300"
        />
        <div className="p-3 flex flex-col gap-2 w-full mt-3">
          <p className="text-lg font-semibold text-slate-700 truncate">
            {listing.name}
          </p>
          <div className="flex items-center gap-1">
            <MapPin className="text-green-600 h-4 w-4" />
            <p className="text-sm w-full text-gray-700 truncate">
              {listing.address}
            </p>
          </div>
          <p className="text-sm w-full text-gray-600 line-clamp-3">
            {listing.description}
          </p>
          <p className=" text-slate-500 mt-2 font-semibold">
            $
            {listing.offer
              ? listing.discountPrice.toLocaleString("en-US")
              : listing.regularPrice.toLocaleString("en-US")}
            {listing.type === "rent" && " / month"}
          </p>
          <div className="text-slate-700 flex gap-4">
            <div className="font-bold text-xs ">
              {listing.bedrooms > 1
                ? `${listing.bedrooms} beds`
                : `${listing.bedrooms} bed `}
            </div>
            <div className="font-bold text-xs ">
              {listing.bathrooms > 1
                ? `${listing.bathrooms} baths`
                : `${listing.bathrooms} bath `}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

import React from "react";
import { assets } from "../assets/assets";
import { Star } from "lucide-react";

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* ---------------- BACKGROUND IMAGE ---------------- */}
      <img
        src={assets.bgImage}
        alt=""
        className="absolute top-0 left-0 -z-1 w-full h-full object-cover"
      />

      {/* ---------------- LEFT - BRANDING ---------------- */}
      <div className="flex-1 flex flex-col items-start justify-between p-6 md:p-10 lg:pl-40">
        <img src={assets.Logo} alt="" className="h-12 object-contain" />

        <div>
          <div className="flex items-center gap-3 mb-4 max-md:mt-10">
            <img src={assets.group_users} alt="" className="h-8 md:h-10" />

            <div>
              <div className="flex items-center gap-3 mb-4 max-md:mt-10">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <Star
                      key={i}
                      className="size-4 md:size-4.5 text-transparent fill-amber-500"
                    />
                  ))}
              </div>

              <p>Trusted by over 12k+ Developers worldwide</p>
            </div>
          </div>

          <h1 className="text-3xl md:text-6xl md:pb-2 font-bold bg-linear-to-r from-teal-950 to-teal-800 bg-clip-text text-transparent">
            {" "}
            Where friendships grow into real connections
          </h1>

          <p className="text-xl md:text-3xl text-teal-900 max-w-72 md:max-w-md">
            Join a global network of creators
          </p>
        </div>

        <span className="md:h-10"></span>
      </div>
      {/* ---------------- RIGHT - LOGIN FORM ---------------- */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10"></div>
    </div>
  );
};

export default Login;

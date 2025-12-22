import { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import Loading from "../components/Loading";
import StoriesBar from "../components/StoriesBar";
import PostCard from "../components/PostCard";
import RecentMessages from "../components/RecentMessages";
import { useAuth } from "@clerk/clerk-react";
import api, { authHeader } from "../api/axios";
import API_ROUTES from "../api/api_route";
import toast from "react-hot-toast";

const Feed = () => {
  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();

  const fetchFeeds = async () => {
    try {
      const token = await getToken();

      setLoading(true);
      const { data } = await api.get(
        API_ROUTES.POST.GET_FEED_POSTS,
        authHeader(token)
      );

      if (data.success) {
        setFeeds(data.posts);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFeeds();
  }, []);

  return !loading ? (
    <div className="h-full overflow-y-scroll no-scrollbar py-10 xl:pr-5 flex items-start justify-center xl:gap-8">
      {/* -------- STORIES AND POST LIST -------- */}
      <div>
        {/* ---- STORIES HERE ---- */}
        <StoriesBar />
        <div className="p-4 space-y-6">
          {feeds.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      </div>

      {/* -------- RIGHT SIDEBAR -------- */}
      <div className="max-xl:hidden sticky top-0">
        <div className="max-w-xs bg-white text-xs p-4 rounded-md inline-flex flex-col gap-2 shadow">
          <h3 className="text-slate-800 font-semibold">Sponsored</h3>

          <img src={assets.sponsored_img} className="w-75 rounded-md" alt="" />

          <p className="text-slate-600">Email marketing</p>

          <p className="text-slate-400">
            Drive engagement and boost sales with a marketing platform that
            works for you.
          </p>
        </div>

        {/* ---- RECENT MESSAGES ---- */}
        <RecentMessages />
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default Feed;

import { MailOpen, Mail, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/usechatStore";
export default function Headers() {
  // const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { authUser } = useAuthStore();
  const {
    messages,

    isMessagesReaded,

    thereIsnewMessageNotification,
    setThereIsnewMessageNotification,
  } = useChatStore();
  const [theLastMessageReaded, setTheLastMessageReaded] = useState();
  // useEffect(() => {
  //   getGlobalMessagesforInbox();
  //   subscribeToMessagesIfReaded();
  //   // if (messages.length > 0) {
  //   //   if (messages.slice(-1)[0].isReaded === true) {
  //   //     setIsTheLastMessageReaded(true);
  //   //     console.log("true");
  //   //   }
  //   //   if (messages.slice(-1)[0].isReaded === false) {
  //   //     setIsTheLastMessageReaded(false);
  //   //     console.log("false");
  //   //   }
  //   // }
  //   return () => unsubscribeFromMessagesIfReaded();
  // }, [subscribeToMessagesIfReaded, unsubscribeFromMessagesIfReaded]);

  // const [isTheLastMessageReaded, setTheLastMessageReaded] = useState(null);
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);
  // console.log(messages.slice(-1)[0]);

  /* je vais modifier ici  */
  useEffect(() => {
    const fetchMessages = async () => {
      if (!authUser) return;
      else {
        await isMessagesReaded(authUser._id); // Assurez-vous que cette fonction met bien à jour `messages` dans le store Zustand.
        const messages = useChatStore.getState().messages; // Récupérer les messages depuis Zustand après mise à jour

        const lastMessage = messages.slice(-1)[0];

        if (lastMessage) {
          if (lastMessage?.readedBy === authUser?._id) {
            setTheLastMessageReaded(false);
            // set({ thereIsnewMessageNotification: true });
            setThereIsnewMessageNotification(false);
          } else {
            setTheLastMessageReaded(true);
            // set({ thereIsnewMessageNotification: false });
            setThereIsnewMessageNotification(true);
          }
        } else return;
      }
    };
    fetchMessages();
  }, [authUser?._id]);
  /* je vais modifier ici  */
  useEffect(() => {
    // Vérifiez si un changement réel est nécessaire
    const lastMessage = messages?.slice(-1)[0];

    if (lastMessage) {
      if (lastMessage?.readedBy === authUser?._id) {
        // setTheLastMessageReaded((prev) => (prev === true ? prev : true));
        setThereIsnewMessageNotification(false);
      } else {
        // setTheLastMessageReaded((prev) => (prev === false ? prev : false));
        setThereIsnewMessageNotification(true);
      }
    }
    return;
  }, [messages]);
  // console.log(isTheLastMessageReaded);
  const subscribe = useChatStore(
    (state) => state.subscribeToMessagesNotification
  );
  const unsubscribe = useChatStore(
    (state) => state.unsubscribeFromMessagesNotification
  );

  useEffect(() => {
    if (authUser) {
      subscribe();

      return () => unsubscribe();
    }
  }, [authUser]); // Supprime les fonctions du tableau de dépendances
  // console.log(thereIsnewMessageNotification);

  return (
    <header className="bg-slate-200 shadow-md p-3">
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        <Link to="/">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-slate-500">Immo</span>
            <span className="text-slate-700">Sphere</span>
          </h1>
        </Link>
        <form
          onSubmit={handleSubmit}
          className="bg-slate-100 p-3 rounded-lg flex items-center"
        >
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus: outline-none w-24  sm:w-64 "
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>
            <Search className="text-slate-600" />
          </button>
        </form>
        <ul className="flex gap-4 items-center">
          {authUser && (
            <Link to="/chat">
              {!thereIsnewMessageNotification ? (
                <li className=" text-slate-700 mt-2 ">
                  <MailOpen />
                </li>
              ) : (
                <li className=" text-slate-700 mt-2  relative">
                  <Mail />
                  <span
                    className=" absolute  text-center 
                  bg-slate-200 text-red-600 rounded-full text-xl font-bold size-5 mx-auto left-2.5 bottom-4"
                  >
                    +
                  </span>
                </li>
              )}
            </Link>
          )}
          <Link to="/">
            <li className="hidden sm:inline text-slate-700 hover:underline ">
              Home
            </li>
          </Link>

          <Link to="/about">
            <li className="hidden sm:inline text-slate-700 hover:underline ">
              About
            </li>
          </Link>

          {authUser ? (
            <Link to="/profile">
              <img
                src={authUser.avatar}
                alt="profile"
                className="w-8 h-8 rounded-full "
              />
            </Link>
          ) : (
            <Link to="/sign-in">
              <li className=" text-slate-700 hover:underline ">Sign In</li>
            </Link>
          )}
        </ul>
      </div>
    </header>
  );
}

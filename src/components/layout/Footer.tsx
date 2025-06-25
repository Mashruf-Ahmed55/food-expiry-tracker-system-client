import {
  Facebook,
  Instagram,
  Mail,
  RefrigeratorIcon,
  Twitter,
} from 'lucide-react';
import { Link, useLocation } from 'react-router';

const Footer = () => {
  const location = useLocation();
  return (
    <footer className="bg-gray-50 pt-12 pb-6 border-t">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
          {/* Brand Section */}
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <RefrigeratorIcon className="w-7 h-7 text-green-500" />
              <span className="font-bold text-xl text-gray-800">
                FreshTrack
              </span>
            </Link>

            <p className="text-gray-600 mb-4 text-sm leading-relaxed max-w-md">
              Stay on top of your kitchen inventory and cut down on food waste.
              FreshTrack helps you easily monitor expiry dates and organize your
              fridge efficiently.
            </p>

            <div className="flex space-x-4">
              <Link
                to="/"
                target="_blank"
                className="text-gray-500 hover:text-green-500 transition"
              >
                <Facebook className="w-5 h-5" />
              </Link>
              <Link
                to="/"
                target="_blank"
                className="text-gray-500 hover:text-green-500 transition"
              >
                <Twitter className="w-5 h-5" />
              </Link>
              <Link
                to="/"
                target="_blank"
                className="text-gray-500 hover:text-green-500 transition"
              >
                <Instagram className="w-5 h-5" />
              </Link>
              <Link
                to="/"
                target="_blank"
                className="text-gray-500 hover:text-green-500 transition"
              >
                <Mail className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:items-end flex flex-col md:text-right text-left">
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className={`text-gray-600 hover:text-green-500 transition ${
                    location.pathname === '/' && 'text-green-500 font-semibold'
                  }`}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/fridge"
                  className={`text-gray-600 hover:text-green-500 transition ${
                    location.pathname === '/fridge' &&
                    'text-green-500 font-semibold'
                  }`}
                >
                  Fridge
                </Link>
              </li>
              <li>
                <Link
                  to="/add-food"
                  className={`text-gray-600 hover:text-green-500 transition ${
                    location.pathname === '/add-food' &&
                    'text-green-500 font-semibold'
                  }`}
                >
                  Add Food
                </Link>
              </li>
              <li>
                <Link
                  to="/my-items"
                  className={`text-gray-600 hover:text-green-500 transition ${
                    location.pathname === '/my-items' &&
                    'text-green-500 font-semibold'
                  }`}
                >
                  My Items
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t pt-6 text-center text-gray-500 text-sm">
          <p>
            &copy; {new Date().getFullYear()} FreshTrack. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

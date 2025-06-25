import { Home, RefrigeratorIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <RefrigeratorIcon className="w-24 h-24 mx-auto text-gray-400" />

          <h1 className="mt-8 text-4xl font-bold text-gray-800">404</h1>
          <h2 className="mt-2 text-2xl font-medium text-gray-700">
            Page Not Found
          </h2>

          <p className="mt-4 text-gray-600">
            Oops! It seems like this page is missing or has expired.
          </p>

          <div className="mt-8">
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200"
            >
              <Home className="w-5 h-5 mr-2" />
              Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;

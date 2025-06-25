import useAuth from '@/hooks/useAuth';
import { generateRandomNumber, getInitials } from '@/lib/utils';
import { RefrigeratorIcon } from 'lucide-react';
import { useState } from 'react';
import { FiMenu } from 'react-icons/fi';
import { MdLogout, MdOutlineAddTask } from 'react-icons/md';
import { RiHome9Line } from 'react-icons/ri';
import { TbFridge, TbSitemap } from 'react-icons/tb';
import { Link, useLocation, useNavigate } from 'react-router';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button, buttonVariants } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

const Navbar = () => {
  const { user: currentUser, logout } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout().then(() => {
        navigate('/');
      });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow w-full h-16 flex items-center justify-center">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <RefrigeratorIcon className="w-8 h-8 text-green-500" />
          <span className="font-bold text-xl">FreshTrack</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-1">
          <Link
            to="/"
            className={`relative px-1 py-2 text-sm font-medium transition-all duration-200 flex items-end gap-x-1 ${
              location.pathname === '/'
                ? 'text-green-600'
                : 'text-gray-500 hover:text-green-600'
            }`}
          >
            <RiHome9Line className="h-5 w-5" />
            Home
          </Link>
          <Link
            to="/fridge"
            className={`relative px-1 py-2 text-sm font-medium transition-all duration-200 flex items-end gap-x-1 ${
              location.pathname === '/fridge'
                ? 'text-green-600'
                : 'text-gray-500 hover:text-green-600'
            }`}
          >
            <TbFridge className="h-4.5 w-4.5" />
            Fridge
          </Link>

          {currentUser?.email && (
            <>
              <Link
                to="/add-food"
                className={`relative px-1 py-2 text-sm font-medium transition-all duration-200 flex items-end gap-x-1 ${
                  location.pathname === '/add-food'
                    ? 'text-green-600'
                    : 'text-gray-500 hover:text-green-600'
                }`}
              >
                <TbSitemap className="h-5 w-5" />
                Add Food
              </Link>
              <Link
                to="/my-items"
                className={`relative px-1 py-2 text-sm font-medium transition-all duration-200 flex items-end gap-x-1 ${
                  location.pathname === '/my-items'
                    ? 'text-green-600'
                    : 'text-gray-500 hover:text-green-600'
                }`}
              >
                <MdOutlineAddTask className="h-5 w-5" />
                My Items
              </Link>
            </>
          )}
        </div>
        <div className="hidden md:flex items-center space-x-2">
          {currentUser?.email ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger className="cursor-pointer focus:outline-none">
                  <Tooltip>
                    <TooltipTrigger asChild className="cursor-pointer">
                      <Avatar className="w-10 h-10">
                        <AvatarImage
                          src={
                            currentUser?.photo_url ||
                            `https://avatar.iran.liara.run/public/${generateRandomNumber()}`
                          }
                          alt={getInitials(currentUser?.name || '')}
                        />
                        <AvatarFallback>
                          {getInitials(currentUser?.name || '')}
                        </AvatarFallback>
                      </Avatar>
                    </TooltipTrigger>
                    <TooltipContent side="right" align="end">
                      <p>{currentUser?.name}</p>
                    </TooltipContent>
                  </Tooltip>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>{currentUser?.name}</DropdownMenuItem>
                  <DropdownMenuItem>{currentUser?.email}</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Button
                      className="w-full"
                      variant={'destructive'}
                      onClick={handleLogout}
                    >
                      Log Out
                      <MdLogout size={22} className="text-white" />
                    </Button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <Link to="/login">
                <Button
                  size={'sm'}
                  variant={'outline'}
                  className="border-green-600 text-green-600"
                >
                  Log In
                </Button>
              </Link>

              <Link to="/register">
                <Button
                  size={'sm'}
                  // className="bg-green-600 hover:bg-transparent hover:text-green-600 border-green-600 border"
                >
                  Register
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <NavbarMobile />
      </div>
    </nav>
  );
};

export default Navbar;

const NavbarMobile = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user: currentUser, logout } = useAuth();
  const handleLogout = async () => {
    try {
      await logout().then(() => {
        navigate('/');
      });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  // Placeholder for mobile navbar component
  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            size={'icon'}
            variant="outline"
            className="text-green-600 bg-transparent border-green-600"
          >
            <FiMenu />
          </Button>
        </SheetTrigger>
        <SheetContent className="w-64">
          <SheetHeader>
            <SheetTitle>Fresh Track</SheetTitle>
          </SheetHeader>
          <div className="grid flex-1 auto-rows-min gap-2 px-4">
            <Link
              onClick={() => setOpen(false)}
              to="/"
              className={buttonVariants({
                variant: location.pathname === '/' ? 'default' : 'secondary',
                size: 'sm',
                className:
                  'relative px-1 py-2 text-sm font-medium transition-all duration-200 flex items-end gap-x-1 ',
              })}
            >
              <RiHome9Line className="h-5 w-5" />
              Home
            </Link>
            <Link
              onClick={() => setOpen(false)}
              to="/fridge"
              className={buttonVariants({
                size: 'sm',
                variant:
                  location.pathname === '/fridge' ? 'default' : 'secondary',
                className:
                  'relative px-1 py-2 text-sm font-medium transition-all duration-200 flex items-end gap-x-1',
              })}
            >
              <TbFridge className="h-4.5 w-4.5" />
              Fridge
            </Link>

            {currentUser?.email && (
              <>
                <Link
                  onClick={() => setOpen(false)}
                  to="/add-food"
                  className={buttonVariants({
                    size: 'sm',
                    variant:
                      location.pathname === '/add-food'
                        ? 'default'
                        : 'secondary',
                    className:
                      'relative px-1 py-2 text-sm font-medium transition-all duration-200 flex items-end gap-x-1',
                  })}
                >
                  <TbSitemap className="h-5 w-5" />
                  Add Food
                </Link>
                <Link
                  onClick={() => setOpen(false)}
                  to="/my-items"
                  className={buttonVariants({
                    size: 'sm',
                    variant:
                      location.pathname === '/my-items'
                        ? 'default'
                        : 'secondary',
                    className:
                      'relative px-1 py-2 text-sm font-medium transition-all duration-200 flex items-end gap-x-1',
                  })}
                >
                  <MdOutlineAddTask className="h-5 w-5" />
                  My Items
                </Link>
              </>
            )}
          </div>
          <SheetFooter>
            {currentUser?.email ? (
              <div className="flex gap-x-2 items-center">
                <Tooltip>
                  <TooltipTrigger asChild className="cursor-pointer">
                    <Avatar className="w-10 h-10">
                      <AvatarImage
                        src={
                          currentUser?.photo_url ||
                          `https://avatar.iran.liara.run/public/${generateRandomNumber()}`
                        }
                        alt={getInitials(currentUser?.name || '')}
                      />
                      <AvatarFallback>
                        {getInitials(currentUser?.name || '')}
                      </AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{currentUser?.name}</p>
                  </TooltipContent>
                </Tooltip>
                <div className=" flex flex-col items-start gap-y-1">
                  <p className="text-sm font-medium leading-none">
                    {currentUser?.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {currentUser?.email}
                  </p>
                  <Button
                    onClick={handleLogout}
                    size={'sm'}
                    variant={'outline'}
                    className="border-green-600 text-green-600 w-full"
                  >
                    Log Out
                    <MdLogout />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link to="/login">
                  <Button
                    onClick={() => setOpen(false)}
                    size={'sm'}
                    variant={'outline'}
                    className="border-green-600 text-green-600 w-full"
                  >
                    Log In
                  </Button>
                </Link>

                <Link to="/register">
                  <Button
                    size={'sm'}
                    className="w-full"
                    onClick={() => setOpen(false)}
                  >
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

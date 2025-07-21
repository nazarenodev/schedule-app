import React, { useState } from 'react';
import { BookingPage } from './pages/BookingPage';
import { CreateEventTypePage } from './pages/CreateEventTypePage';
import { AddAvailabilityPage } from './pages/AddAvailabilityPage';
import { MyBookingsPage } from './pages/MyBookingsPage';

type Page = 'booking' | 'createEvent' | 'addAvailability' | 'myBookings';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('booking');
  
  // In a real app, this would come from an authentication context
  const currentUserId = "user_john_doe"; // Can be 'user_john_doe' or 'user_jane_doe'
  const bookerId = "user_jane_doe";

  const renderPage = () => {
      switch(currentPage) {
          case 'createEvent':
              return <CreateEventTypePage ownerId={currentUserId} />;
          case 'addAvailability':
              return <AddAvailabilityPage ownerId={currentUserId} />;
          case 'myBookings':
              return <MyBookingsPage userId={currentUserId} />;
          case 'booking':
          default:
              return <BookingPage bookerId={bookerId} />;
      }
  };

  const NavButton: React.FC<{page: Page, label: string}> = ({ page, label }) => (
    <button 
        onClick={() => setCurrentPage(page)} 
        className={`px-3 py-2 rounded-md text-sm font-medium ${currentPage === page ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:bg-gray-100'}`}
    >
        {label}
    </button>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white shadow-sm w-full">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Scheduler</h1>
            <nav className="space-x-2 sm:space-x-4">
                <NavButton page="booking" label="Book Event" />
                <NavButton page="myBookings" label="My Bookings" />
                <NavButton page="createEvent" label="Create Type" />
                <NavButton page="addAvailability" label="Add Availability" />
            </nav>
          </div>
        </div>
      </header>
      <main className="w-full py-6 flex justify-center">
        <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            {renderPage()}
        </div>
      </main>
    </div>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { getUserLocationFromIP, findNearestSalon } from '@/lib/nearest-salon';

export default function IntroSection() {
  const [nearestSalon, setNearestSalon] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const findSalon = async () => {
      try {
        // Get salons data
        const salonsResponse = await fetch('/data/salons.json');
        const salons = await salonsResponse.json();
        
        // Get user location from IP
        const location = await getUserLocationFromIP();
        
        if (location && location.latitude && location.longitude) {
          const nearest = findNearestSalon(location.latitude, location.longitude, salons);
          setNearestSalon(nearest);
        }
      } catch (error) {
        console.error('Error finding nearest salon:', error);
      } finally {
        setLoading(false);
      }
    };

    findSalon();
  }, []);

  return (
    <section className="py-24 md:py-32 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        {/* Text */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-[11px] tracking-[0.3em] uppercase text-neutral-400 mb-4">
            Welcome to
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-neutral-900 mb-8 leading-tight">
            The Salon Edit
          </h2>
          <p className="text-neutral-600 leading-relaxed mb-6">
            Your low tox salon where expert stylists make your hair dreams come true. We recognise the uniqueness of each client and the distinctiveness of their hair needs. That's why we prioritise a personalised approach, ensuring that every visit is tailored to your individual preferences.
          </p>
          <p className="text-neutral-600 leading-relaxed mb-10">
            We believe in not just enhancing your hair but also in nurturing its health and vitality. This is why we use Kevin Murphy for low-toxicity colour products — stunning results while ensuring the utmost care for your hair and scalp.
          </p>

          {/* Nearest Salon Info */}
          {!loading && nearestSalon && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-neutral-50 p-6 rounded-lg mb-10 border border-neutral-200"
            >
              <p className="text-[11px] tracking-[0.3em] uppercase text-neutral-400 mb-2">
                Your Nearest Salon
              </p>
              <h3 className="font-serif text-xl text-neutral-900 mb-2">
                The Salon Edit (formerly {nearestSalon.name})
              </h3>
              <p className="text-neutral-600 text-sm mb-4">
                📍 {nearestSalon.address}, {nearestSalon.state} {nearestSalon.postcode}
              </p>
              <p className="text-neutral-600 text-sm leading-relaxed mb-4">
                We've transformed this location by adding expert stylists, redesigning the space, and introducing our signature low-toxicity services to better serve you.
              </p>
              {nearestSalon.phone && (
                <p className="text-neutral-600 text-sm mb-3">
                  📞 {nearestSalon.phone}
                </p>
              )}
              <p className="text-neutral-500 text-xs italic">
                💇‍♀️ Our stylists also offer at-home services. Contact your local salon for availability and booking.
              </p>
            </motion.div>
          )}

          <Link
            to={createPageUrl('Bookings')}
            className="inline-block bg-neutral-900 text-white px-10 py-4 text-[11px] tracking-[0.25em] uppercase font-medium hover:bg-neutral-800 transition-all duration-300"
          >
            Book Now
          </Link>
        </motion.div>

        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div className="aspect-[3/4] overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80"
              alt="Salon styling"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -left-6 w-32 h-32 border border-neutral-200 -z-10" />
        </motion.div>
      </div>
    </section>
  );
}
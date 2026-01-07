import React from 'react';
import { NavigationProps } from '../types';

const ReviewsView: React.FC<NavigationProps> = ({ navigateTo }) => {
  const reviews = [
    {
      name: "Sarah M.",
      location: "Liverpool",
      rating: 5,
      service: "End of Lease Clean",
      date: "2 weeks ago",
      text: "Absolutely phenomenal service! The team did our end of lease clean and we got our full bond back. They were thorough, professional, and the place looked brand new. Highly recommend!",
      verified: true
    },
    {
      name: "Michael T.",
      location: "Campbelltown",
      rating: 5,
      service: "Commercial Office",
      date: "1 month ago",
      text: "We've been using Clean Up Bros for our office cleaning for 6 months now. Always on time, never miss a spot, and super professional. Our workplace has never looked better!",
      verified: true
    },
    {
      name: "Emma L.",
      location: "Parramatta",
      rating: 5,
      service: "Airbnb Turnover",
      date: "3 days ago",
      text: "As an Airbnb host, timing is everything. Clean Up Bros never lets me down. They're fast, efficient, and my guests always comment on how spotless the place is. Worth every penny!",
      verified: true
    },
    {
      name: "David K.",
      location: "Bankstown",
      rating: 5,
      service: "Deep Clean",
      date: "2 months ago",
      text: "Had them do a deep clean before my parents visited. They transformed my apartment! Even cleaned areas I forgot existed. The attention to detail was incredible.",
      verified: true
    },
    {
      name: "Jessica R.",
      location: "Camden",
      rating: 5,
      service: "Post-Construction",
      date: "1 week ago",
      text: "After our renovation, the house was a disaster. Clean Up Bros came in and made it look showroom ready. They removed all the dust, cleaned every surface, and even polished the windows. Amazing work!",
      verified: true
    },
    {
      name: "Tom W.",
      location: "Moorebank",
      rating: 5,
      service: "Regular Cleaning",
      date: "3 weeks ago",
      text: "Been using their bi-weekly service for a year now. It's like having a consistently clean home without any effort. The team is friendly, trustworthy, and does a fantastic job every time.",
      verified: true
    },
    {
      name: "Priya S.",
      location: "Fairfield",
      rating: 5,
      service: "Residential Clean",
      date: "1 month ago",
      text: "Very impressed! They worked around my schedule, arrived exactly on time, and cleaned every room to perfection. Even my teenage son noticed how clean his room was!",
      verified: true
    },
    {
      name: "James H.",
      location: "Prestons",
      rating: 5,
      service: "Office Clean",
      date: "2 weeks ago",
      text: "Clean Up Bros has been cleaning our medical centre for 3 months. They understand the importance of hygiene in healthcare and always go above and beyond. Couldn't ask for better service.",
      verified: true
    },
    {
      name: "Rachel B.",
      location: "Casula",
      rating: 5,
      service: "Spring Clean",
      date: "1 week ago",
      text: "Did a spring clean of our entire house including windows, carpets, and oven. The place sparkles! They even organized my pantry without me asking. So happy with the results!",
      verified: true
    }
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="hero-unit min-h-[650px] md:min-h-[750px] bg-black text-white mb-0 relative group overflow-hidden">
        <div className="hero-unit-text flex flex-col items-center">
          <div className="flex gap-1 mb-4 animate-fade-in-up">
            {[1,2,3,4,5].map(i => (
              <svg key={i} className="w-12 h-12 md:w-16 md:h-16 text-brand-gold fill-current drop-shadow-lg" viewBox="0 0 20 20">
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
              </svg>
            ))}
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4 leading-tight text-center drop-shadow-2xl text-white">
            Customer Reviews
          </h1>
          <p className="text-2xl md:text-3xl font-semibold mb-2 text-center drop-shadow-lg">
            4.9 out of 5
          </p>
          <p className="text-lg md:text-xl font-medium mb-8 text-center text-white/90 drop-shadow-md">
            Based on 127+ verified Google reviews
          </p>
          <button
            onClick={() => navigateTo('ClientFeedback')}
            className="px-8 py-4 rounded-full bg-white text-[#1D1D1F] hover:bg-gray-100 shadow-lg hover:shadow-2xl transform hover:scale-105 active:scale-95 transition-all duration-300 font-semibold text-lg"
          >
            Leave a Review
          </button>
        </div>
        <div
          className="absolute inset-0 bg-cover bg-center animate-slow-zoom"
          style={{
            backgroundImage: `url(https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1920&q=80)`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
      </div>

      {/* Inspirational Quote Section */}
      <div className="bg-gradient-to-br from-[#F5F5F7] to-white py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <svg className="w-16 h-16 md:w-20 md:h-20 text-brand-gold mx-auto mb-6 opacity-60" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
          </svg>
          <p className="text-2xl md:text-4xl font-light text-[#1D1D1F] italic leading-relaxed mb-6">
            "A clean space is not just about appearance—it's about creating an environment where life, business, and dreams can flourish."
          </p>
          <p className="text-xl text-brand-gold font-semibold">— Clean Up Bros Philosophy</p>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <div className="apple-card p-6 text-center transform hover:scale-105 transition-all duration-300">
            <div className="text-5xl mb-3">✅</div>
            <div className="font-bold text-lg text-[#1D1D1F]">Verified Reviews</div>
            <div className="text-sm text-[#86868b] mt-1">Real customers only</div>
          </div>
          <div className="apple-card p-6 text-center transform hover:scale-105 transition-all duration-300">
            <div className="text-5xl mb-3">🏆</div>
            <div className="font-bold text-lg text-[#1D1D1F]">5-Star Service</div>
            <div className="text-sm text-[#86868b] mt-1">Consistently rated</div>
          </div>
          <div className="apple-card p-6 text-center transform hover:scale-105 transition-all duration-300">
            <div className="text-5xl mb-3">💯</div>
            <div className="font-bold text-lg text-[#1D1D1F]">100% Satisfaction</div>
            <div className="text-sm text-[#86868b] mt-1">Guaranteed results</div>
          </div>
          <div className="apple-card p-6 text-center transform hover:scale-105 transition-all duration-300">
            <div className="text-5xl mb-3">👥</div>
            <div className="font-bold text-lg text-[#1D1D1F]">500+ Clients</div>
            <div className="text-sm text-[#86868b] mt-1">Happy customers</div>
          </div>
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-[#1D1D1F] text-center mb-12">
          What Our Customers Say
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="apple-card p-6 flex flex-col h-full transform hover:scale-[1.02] transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="font-bold text-lg text-[#1D1D1F]">{review.name}</div>
                  <div className="text-sm text-[#86868b]">{review.location}</div>
                </div>
                {review.verified && (
                  <span className="text-xs bg-green-50 text-green-700 px-3 py-1 rounded-full font-semibold border border-green-200">
                    ✓ Verified
                  </span>
                )}
              </div>

              <div className="flex gap-1 mb-3">
                {[1,2,3,4,5].map(i => (
                  <svg key={i} className="w-5 h-5 text-brand-gold fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                  </svg>
                ))}
              </div>

              <div className="text-sm font-semibold text-[#0071e3] mb-3">{review.service}</div>

              <p className="text-[#1D1D1F] mb-4 flex-grow leading-relaxed">{review.text}</p>

              <div className="text-xs text-[#86868b]">{review.date}</div>
            </div>
          ))}
        </div>
      </div>

      {/* What Customers Love */}
      <div className="bg-gradient-to-br from-[#F5F5F7] to-white py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-[#1D1D1F] text-center mb-16">
            What Our Customers Love
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="apple-card p-8 text-center transform hover:scale-105 transition-all duration-300">
              <div className="text-6xl mb-6">⚡</div>
              <h3 className="text-2xl font-bold text-[#1D1D1F] mb-4">Speed & Efficiency</h3>
              <p className="text-[#86868b] text-lg leading-relaxed">
                "They get the job done fast without compromising quality"
              </p>
            </div>

            <div className="apple-card p-8 text-center transform hover:scale-105 transition-all duration-300">
              <div className="text-6xl mb-6">🤝</div>
              <h3 className="text-2xl font-bold text-[#1D1D1F] mb-4">Professional Team</h3>
              <p className="text-[#86868b] text-lg leading-relaxed">
                "Friendly, respectful, and always professional"
              </p>
            </div>

            <div className="apple-card p-8 text-center transform hover:scale-105 transition-all duration-300">
              <div className="text-6xl mb-6">💎</div>
              <h3 className="text-2xl font-bold text-[#1D1D1F] mb-4">Attention to Detail</h3>
              <p className="text-[#86868b] text-lg leading-relaxed">
                "They clean areas I didn't even think of"
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Get Quote CTA */}
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-[#1D1D1F] mb-6">
          Join Our Happy Customers
        </h2>
        <p className="text-xl md:text-2xl text-[#86868b] mb-10">
          Experience 5-star cleaning service today
        </p>
        <button
          onClick={() => navigateTo('Landing')}
          className="btn-primary text-xl px-12 py-4 shadow-lg hover:shadow-xl"
        >
          Get Your Free Quote
        </button>
      </div>
    </div>
  );
};

export default ReviewsView;

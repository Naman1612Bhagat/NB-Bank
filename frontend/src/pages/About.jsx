import React from 'react';
import { Building2, Users, Globe2, ShieldCheck } from 'lucide-react';

const About = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white py-32 overflow-hidden" style={{ backgroundImage: "url('/assets/about_hero.png')", backgroundSize: "cover", backgroundPosition: "center" }}>
        <div className="absolute inset-0 bg-black/60 z-0"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 shadow-lg">About NB Bank</h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto font-light leading-relaxed">
            Empowering your financial future through innovative technology, unwavering security, and unparalleled customer service.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 relative inline-block pb-3">
                Our Story
                <span className="absolute bottom-0 left-0 w-33 h-1 bg-[var(--accent-color)] rounded-full"></span>
              </h2>
              <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                Founded with the vision of redefining modern banking, NB Bank has grown from a visionary concept into a trusted financial institution serving millions globally.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                We believe that banking should be transparent, secure, and accessible to everyone. By blending cutting-edge technology with traditional financial wisdom, we deliver an experience that puts our customers first.
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-500 animate-slide-up delay-100">
              <img src="/assets/our_story.png" alt="Our Story" className="w-full h-auto object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Our Core Values</h2>
            <p className="mt-4 text-lg text-gray-600">The principles that guide every decision we make.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="text-[var(--primary-color)]" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Uncompromising Security</h3>
              <p className="text-gray-600">Your assets and data are protected by military-grade encryption and rigorous security protocols.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="text-yellow-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Customer First</h3>
              <p className="text-gray-600">Every feature we build and service we provide is designed with your financial well-being in mind.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Globe2 className="text-green-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Global Innovation</h3>
              <p className="text-gray-600">We constantly push the boundaries of financial technology to bring you borderless, frictionless banking.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

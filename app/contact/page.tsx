import Navbar from "@/components/layout/Navbar";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-24 px-6 md:px-12 max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-light tracking-wider mb-8">
          CONTACT US
        </h1>
        <form className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-400 focus:border-transparent"
              placeholder="Your name"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-400 focus:border-transparent"
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Message
            </label>
            <textarea
              id="message"
              rows={5}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-400 focus:border-transparent"
              placeholder="Your message"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white py-3 px-6 rounded-md hover:bg-gray-800 transition-colors"
          >
            Send Message
          </button>
        </form>
      </main>
    </div>
  );
}

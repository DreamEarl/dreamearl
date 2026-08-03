import { PhoneIcon, MailIcon, InstagramIcon } from "@/components/ui/icons";

export default function ContactUs() {
  return (
    <div id="contact-us" className="flex-1 p-8 flex flex-col justify-center">
      <h2 className="text-xl mb-6 tracking-wide">CONTACT US</h2>

      <p className="text-gray-600 mb-8 text-sm md:text-base">
        Choose your preferred method of contact and connect with us
      </p>

      {/* Phone Section */}
      <div id="contact-phone" className="mb-8">
        <h3 className="text-lg font-semibold mb-3">PHONE</h3>
        <p className="text-sm text-gray-600 mb-2">
          Monday to Sunday from 11 am to 6 pm (IST).
        </p>
        <a
          href="tel:+918830587508"
          className="flex items-center gap-2 text-sm font-medium hover:underline"
        >
          <PhoneIcon />
          CALL US +91 8830587508
        </a>
      </div>

      {/* Email Section */}
      <div id="contact-email" className="mb-8">
        <h3 className="text-lg font-semibold mb-3">EMAIL</h3>
        <a
          href="mailto:mydreamearl.shop@gmail.com"
          className="flex items-center gap-2 text-sm font-medium hover:underline"
        >
          <MailIcon />
          Write Us at mydreamearl.shop@gmail.com
        </a>
      </div>

      {/* Instagram Section */}
      <div id="contact-instagram">
        <h3 className="text-lg font-semibold mb-3">INSTAGRAM</h3>
        <p className="text-sm text-gray-600 mb-2">
          Follow Us on Instagram & DM to place an Order
        </p>
        <a
          href="https://www.instagram.com/dreamearl.shop?igsh=d3RmaGJ2NnViYWM4&utm_source=qr"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm font-medium hover:underline"
        >
          <InstagramIcon />
          @dreamearl.shop
        </a>
      </div>
    </div>
  );
}

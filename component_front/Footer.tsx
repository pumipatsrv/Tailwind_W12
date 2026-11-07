import Link from 'next/link'
import { Facebook, Instagram } from '@tailgrids/icons'

// TODO: ใส่ลิงก์โซเชียลของตัวเอง
const FACEBOOK_URL = 'https://facebook.com'
const INSTAGRAM_URL = 'https://instagram.com'

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-slate-200 bg-white py-8 text-center">
      <p className="text-sm font-semibold text-slate-800">
        68032408 จักรกฤษ มะตะผล
      </p>
      <p className="mt-1 text-xs text-slate-500">
        School of Information Technology, Sripatum University
      </p>

      <div className="mt-4 flex justify-center gap-3">
        <Link
          href={FACEBOOK_URL}
          target="_blank"
          aria-label="Facebook"
          className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-blue-700 transition hover:bg-blue-50"
        >
          <Facebook />
        </Link>
        <Link
          href={INSTAGRAM_URL}
          target="_blank"
          aria-label="Instagram"
          className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-rose-500 transition hover:bg-rose-50"
        >
          <Instagram />
        </Link>
      </div>

      <p className="mt-4 text-xs text-slate-400">CSI205 · Front-End Software Development</p>
    </footer>
  )
}
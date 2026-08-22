import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-inverse-surface dark:bg-surface-container-lowest w-full py-xl border-t border-outline-variant dark:border-outline no shadows">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-lg px-gutter max-w-container-max mx-auto">
        <div className="col-span-2 lg:col-span-2">
          <span className="font-headline-md text-headline-md font-bold text-primary-fixed dark:text-primary flex items-center gap-2 mb-md">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              cloud
            </span>
            CloudNova
          </span>
          <p className="font-body-sm text-body-sm text-surface-variant dark:text-on-surface-variant mb-lg">
            © 2024 CloudNova Infrastructure. All rights reserved.
          </p>
        </div>
        <div>
          <h4 className="font-label-caps text-label-caps text-surface-variant dark:text-on-surface-variant mb-md opacity-70">
            Company
          </h4>
          <ul className="space-y-sm">
            <li>
              <Link
                className="font-body-sm text-body-sm text-surface-variant dark:text-on-surface-variant hover:text-white transition-colors hover:underline"
                href="/about"
              >
                Về chúng tôi
              </Link>
            </li>
            <li>
              <Link
                className="font-body-sm text-body-sm text-surface-variant dark:text-on-surface-variant hover:text-white transition-colors hover:underline"
                href="/news"
              >
                Tin tức
              </Link>
            </li>
            <li>
              <Link
                className="font-body-sm text-body-sm text-surface-variant dark:text-on-surface-variant hover:text-white transition-colors hover:underline"
                href="/lien-he"
              >
                Liên hệ
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-label-caps text-label-caps text-surface-variant dark:text-on-surface-variant mb-md opacity-70">
            Legal
          </h4>
          <ul className="space-y-sm">
            <li>
              <Link
                className="font-body-sm text-body-sm text-surface-variant dark:text-on-surface-variant hover:text-white transition-colors hover:underline"
                href="/dieu-khoan"
              >
                Điều khoản
              </Link>
            </li>
            <li>
              <Link
                className="font-body-sm text-body-sm text-surface-variant dark:text-on-surface-variant hover:text-white transition-colors hover:underline"
                href="/bao-mat"
              >
                Bảo mật
              </Link>
            </li>
            <li>
              <Link
                className="font-body-sm text-body-sm text-surface-variant dark:text-on-surface-variant hover:text-white transition-colors hover:underline"
                href="/sla"
              >
                SLA
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-label-caps text-label-caps text-surface-variant dark:text-on-surface-variant mb-md opacity-70">
            Resources
          </h4>
          <ul className="space-y-sm">
            <li>
              <Link
                className="font-body-sm text-body-sm text-surface-variant dark:text-on-surface-variant hover:text-white transition-colors hover:underline"
                href="/huong-dan"
              >
                Hướng dẫn
              </Link>
            </li>
            <li>
              <Link
                className="font-body-sm text-body-sm text-surface-variant dark:text-on-surface-variant hover:text-white transition-colors hover:underline"
                href="/api-docs"
              >
                API Documentation
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

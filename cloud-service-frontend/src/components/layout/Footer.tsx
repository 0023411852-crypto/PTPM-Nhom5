import React from "react";
import Link from "next/link";
import { css } from "styled-system/css";

async function getStaticPages() {
  try {
    const API_URL = process.env.API_PROXY_URL || "http://localhost:5154";
    const res = await fetch(`${API_URL}/api/StaticPages?onlyPublished=true&PageNumber=1&PageSize=10`, {
      next: { revalidate: 60 }
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.items || [];
  } catch (e) {
    return [];
  }
}

export default async function Footer() {
  const staticPages = await getStaticPages();

  return (
    <footer className={css({
      backgroundColor: "inverse-surface",
      width: "full",
      paddingY: "xl",
      borderTop: "1px solid",
      borderColor: "outline-variant",
    })}>
      <div className={css({
        display: "grid",
        gridTemplateColumns: { base: "2", md: "4", lg: "6" },
        gap: "lg",
        paddingX: "gutter",
        maxWidth: "container-max",
        marginX: "auto",
      })}>
        <div className={css({
          gridColumn: { base: "span-2", lg: "span-2" },
        })}>
          <span className={css({
            fontSize: "headline-md",
            fontWeight: "bold",
            color: "primary-fixed",
            display: "flex",
            alignItems: "center",
            gap: "2",
            marginBottom: "md",
          })}>
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              cloud
            </span>
            CloudNova
          </span>
          <p className={css({
            fontSize: "body-sm",
            color: "surface-variant",
            marginBottom: "lg",
          })}>
            © 2024 CloudNova Infrastructure. All rights reserved.
          </p>
        </div>
        <div>
          <h4 className={css({
            fontSize: "label-caps",
            fontWeight: "label-caps",
            color: "surface-variant",
            marginBottom: "md",
            opacity: "0.7",
          })}>
            Company
          </h4>
          <ul className={css({ display: "flex", flexDirection: "column", gap: "sm" })}>
            <li>
              <Link
                className={css({
                  fontSize: "body-sm",
                  color: "surface-variant",
                  _hover: { color: "white", textDecoration: "underline" },
                  transition: "colors",
                })}
                href="/about"
              >
                Về chúng tôi
              </Link>
            </li>
            <li>
              <Link
                className={css({
                  fontSize: "body-sm",
                  color: "surface-variant",
                  _hover: { color: "white", textDecoration: "underline" },
                  transition: "colors",
                })}
                href="/news"
              >
                Tin tức
              </Link>
            </li>
            <li>
              <Link
                className={css({
                  fontSize: "body-sm",
                  color: "surface-variant",
                  _hover: { color: "white", textDecoration: "underline" },
                  transition: "colors",
                })}
                href="/lien-he"
              >
                Liên hệ
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className={css({
            fontSize: "label-caps",
            fontWeight: "label-caps",
            color: "surface-variant",
            marginBottom: "md",
            opacity: "0.7",
          })}>
            Chính sách & Pháp lý
          </h4>
          <ul className={css({ display: "flex", flexDirection: "column", gap: "sm" })}>
            {staticPages.length > 0 ? (
                staticPages.map((page: any) => (
                    <li key={page.id}>
                      <Link
                        className={css({
                          fontSize: "body-sm",
                          color: "surface-variant",
                          _hover: { color: "white", textDecoration: "underline" },
                          transition: "colors",
                        })}
                        href={`/${page.slug}`}
                      >
                        {page.title}
                      </Link>
                    </li>
                ))
            ) : (
                <>
                    <li>
                      <Link
                        className={css({
                          fontSize: "body-sm",
                          color: "surface-variant",
                          _hover: { color: "white", textDecoration: "underline" },
                          transition: "colors",
                        })}
                        href="/dieu-khoan"
                      >
                        Điều khoản
                      </Link>
                    </li>
                    <li>
                      <Link
                        className={css({
                          fontSize: "body-sm",
                          color: "surface-variant",
                          _hover: { color: "white", textDecoration: "underline" },
                          transition: "colors",
                        })}
                        href="/bao-mat"
                      >
                        Bảo mật
                      </Link>
                    </li>
                    <li>
                      <Link
                        className={css({
                          fontSize: "body-sm",
                          color: "surface-variant",
                          _hover: { color: "white", textDecoration: "underline" },
                          transition: "colors",
                        })}
                        href="/sla"
                      >
                        SLA
                      </Link>
                    </li>
                </>
            )}
          </ul>
        </div>
        <div>
          <h4 className={css({
            fontSize: "label-caps",
            fontWeight: "label-caps",
            color: "surface-variant",
            marginBottom: "md",
            opacity: "0.7",
          })}>
            Resources
          </h4>
          <ul className={css({ display: "flex", flexDirection: "column", gap: "sm" })}>
            <li>
              <Link
                className={css({
                  fontSize: "body-sm",
                  color: "surface-variant",
                  _hover: { color: "white", textDecoration: "underline" },
                  transition: "colors",
                })}
                href="/huong-dan"
              >
                Hướng dẫn
              </Link>
            </li>
            <li>
              <Link
                className={css({
                  fontSize: "body-sm",
                  color: "surface-variant",
                  _hover: { color: "white", textDecoration: "underline" },
                  transition: "colors",
                })}
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

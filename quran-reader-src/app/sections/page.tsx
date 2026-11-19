"use client";

import Link from "next/link";
import { DEFAULT_LAYOUT } from "@/lib/layouts";
import { SURAHS, JUZS, MANZILS, SAJDAS, HIZBS, RUKUS, surahBnName, surahById } from "@/lib/data";
import { bn, hizbLabel, TYPE_BN, SAJDA_BN } from "@/lib/bn";

const mushaf = (page: number) => `/reader/${page}?print=${DEFAULT_LAYOUT}`;

export default function IndexPage() {
  return (
    <main className="page">
      <h1>সূচি</h1>
      <nav className="jump" aria-label="Sections">
        <a href="#surahs">সূরা</a>
        <a href="#juz">পারা</a>
        <a href="#manzil">মানযিল</a>
        <a href="#hizb">হিজব</a>
        <a href="#ruku">রুকু</a>
        <a href="#sajda">সিজদা</a>
      </nav>

      <section id="surahs">
        <h2>সূরা ({bn(SURAHS.length)})</h2>
        <div className="table-wrap">
          <table>
            <thead><tr><th>#</th><th>সূরা</th><th>আয়াত</th><th>ধরন</th><th>পৃষ্ঠা</th></tr></thead>
            <tbody>
              {SURAHS.map((s) => (
                <tr key={s.id}>
                  <td>{bn(s.id)}</td>
                  <td>
                    <Link href={`/surah/${s.id}`}>{surahBnName(s.id)}</Link>
                    <span className="ar-inline" dir="rtl"> {s.name}</span>
                    <small className="en"> {s.tname}</small>
                  </td>
                  <td>{bn(s.ayahs)}</td>
                  <td>{TYPE_BN[s.type] ?? s.type}</td>
                  <td><Link href={mushaf(s.page)}>{bn(s.page)}</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="juz">
        <h2>পারা ({bn(JUZS.length)})</h2>
        <ul className="chips">
          {JUZS.map((j) => {
            const start = surahById(j.sura);
            return (
              <li key={j.juz}>
                <Link href={`/juz/${j.juz}`}>পারা {bn(j.juz)}</Link>
                <small> {start ? surahBnName(start.id) : ""} {bn(j.aya)}</small>
              </li>
            );
          })}
        </ul>
      </section>

      <section id="manzil">
        <h2>মানযিল ({bn(MANZILS.length)})</h2>
        <ul className="chips">
          {MANZILS.map((m) => <li key={m.manzil}><Link href={mushaf(m.page)}>মানযিল {bn(m.manzil)} · পৃ. {bn(m.page)}</Link></li>)}
        </ul>
      </section>

      <section id="hizb">
        <h2>হিজব ({bn(HIZBS.length)} কোয়ার্টার)</h2>
        <ul className="chips">
          {HIZBS.map((h) => <li key={h.quarter}><Link href={mushaf(h.page)}>{hizbLabel(h.hizb, h.part)} · পৃ. {bn(h.page)}</Link></li>)}
        </ul>
      </section>

      <section id="ruku">
        <h2>রুকু ({bn(RUKUS.length)})</h2>
        <ul className="chips">
          {RUKUS.map((r) => <li key={r.ruku}><Link href={mushaf(r.page)}>রুকু {bn(r.ruku)}</Link></li>)}
        </ul>
      </section>

      <section id="sajda">
        <h2>সিজদা ({bn(SAJDAS.length)})</h2>
        <ul className="chips">
          {SAJDAS.map((s) => <li key={s.sajda}><Link href={mushaf(s.page)}>সিজদা {bn(s.sajda)} · {SAJDA_BN[s.type] ?? s.type} · পৃ. {bn(s.page)}</Link></li>)}
        </ul>
      </section>
    </main>
  );
}

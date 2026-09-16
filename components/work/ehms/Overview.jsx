'use client';

import { useStandardEntrance } from '@/lib/useStandardEntrance';

// Figma node 912:137「project overview」，1085×895，y=1800.576。
//
// 912:145 在 Figma 是一個 243px 高的單一 text 圖層。依語意斷成三段
// <p>（使用者確認）：①這一頁在講什麼 ②床墊與褥瘡的背景 ③App 之前的
// 操作方式。段落內的粗體是 Figma 原本就有的強調，不是我加的，保留。
//
// ⚠️ 三張卡下方還有一段「My Role」（node 912:174），使用者原本的區塊
// 清單裡沒列到，讀 Figma 才發現，已回報並確認要做。
export default function Overview() {
  const ref = useStandardEntrance('.eh-in');

  return (
    <section className="eh-section eh-col" ref={ref} aria-labelledby="eh-overview-h">
      <h2 className="eh-head eh-in" id="eh-overview-h">
        <span className="eh-sec-num">01 Overview</span>
        <span className="eh-sec-title">What is this project?</span>
      </h2>

      <div className="eh-body eh-in">
        <p>
          This page is about how I learned to design an interface. eHMS was my first UI project.{' '}
          <strong>No one on the team had worked on UI before, including me,</strong> so we built the
          process as we went. Most of what follows is about the decisions I made, the ones I got
          wrong, and how I worked with engineers and a manager who had no design background.
        </p>
        <p>
          eBio makes smart pressure-relief beds. People who stay in bed for long periods are prone to
          pressure ulcers. The main causes are poor circulation and sustained pressure on the sacrum,
          hips, shoulder blades and heels.{' '}
          <strong>The bed uses soft pressure sensors to map how a person is lying,</strong> finds the
          areas at risk, and moves the pressure away from them.
        </p>
        <p>
          Before the app, the bed could only be operated from a unit at the bedside. There was one
          unit per bed and the screen was small.{' '}
          <strong>Nurses walked to each bed to read the data and change the mode.</strong> Family
          members and older carers had to memorise the steps. The company decided to move the
          controls onto a phone, so that one device could reach several beds.
        </p>
      </div>

      <div className="eh-cards">
        <article className="eh-card eh-in">
          <img
            className="eh-card-icon"
            src="/work/ehms/icon-problems.svg"
            width={61}
            height={61}
            loading="lazy"
            alt=""
          />
          <div>
            <h3>Problems</h3>
            <p>
              <strong>One unit per bed</strong>, with a small screen. Nurses walked to each bedside
              to read data and change modes. The steps had to be memorised, which was hard for
              family members and older carers.
            </p>
          </div>
        </article>

        <article className="eh-card eh-in">
          <img
            className="eh-card-icon"
            src="/work/ehms/icon-user.svg"
            width={61}
            height={61}
            loading="lazy"
            alt=""
          />
          <div>
            <h3>User</h3>
            <p>
              Nurses, care workers and family members.{' '}
              <strong>Nurses work fast and often with one hand.</strong> Family members are usually
              older and less familiar with apps.
            </p>
          </div>
        </article>

        <article className="eh-card eh-in">
          <img
            className="eh-card-icon"
            src="/work/ehms/icon-solution.svg"
            width={61}
            height={61}
            loading="lazy"
            alt=""
          />
          <div>
            <h3>Solution</h3>
            <p>
              The bed&rsquo;s controls and records moved onto the phone. Users read lying data and
              alerts remotely, and{' '}
              <strong>manage several beds from one device.</strong>
            </p>
          </div>
        </article>
      </div>

      <div className="eh-role eh-in">
        <h3 className="eh-role-label">My Role</h3>
        <p>
          I designed the app UI. The engineering lead decided how the pages connected, and I worked
          with two engineers on what could be built. I joined site visits and bed testing, and I also
          designed the user manual for the bed.
        </p>
      </div>
    </section>
  );
}

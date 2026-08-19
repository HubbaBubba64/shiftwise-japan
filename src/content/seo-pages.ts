import type { Locale } from "@/i18n/messages";

export type SeoPage = {
  locale: Locale; slug: string; alternateSlug: string; title: string; description: string;
  h1: string; eyebrow: string; intro: string; showCalculator: boolean;
  sections: Array<{ heading: string; paragraphs: string[]; points?: string[] }>;
  faqs: Array<{ question: string; answer: string }>;
  nextSlug?: string; nextLabel?: string;
};

const pages: SeoPage[] = [
  {
    locale: "en", slug: "international-student-work-hours-japan", alternateSlug: "留学生-28時間",
    title: "International Student Work Hours Calculator Japan | ShiftWise Japan",
    description: "Combine multiple jobs and check normal-school weekly hours or official long-vacation daily hours as an international student in Japan.",
    h1: "Check Your Part-Time Work Hours in Japan", eyebrow: "Free work-hours calculator",
    intro: "Add every job in one place. ShiftWise combines your hours and applies the reference for the school period you select.", showCalculator: true,
    sections: [
      { heading: "Combine every part-time job", paragraphs: ["A total from one employer does not show your complete schedule. Enter each job separately and ShiftWise combines the hours before showing your status."], points: ["Monday-to-Sunday weekly history", "All jobs combined", "Separate normal and official-vacation modes"] },
      { heading: "Two periods, two different checks", paragraphs: ["During a normal school period, the configured general reference is 28 hours per week. During an official long vacation designated by your school, enter shifts by day and compare the combined daily total with 8 hours. The calculator does not treat 40 hours as a universal weekly limit."] },
    ],
    faqs: [
      { question: "Do hours from two jobs count together?", answer: "ShiftWise combines every job you enter. Check your individual permission and official guidance for the conditions that apply to you." },
      { question: "Is 28 hours automatically allowed for every student?", answer: "No. This reference is relevant only when your status and individual permission include that condition." },
      { question: "How are long-vacation hours checked?", answer: "Use daily entry. The calculator combines all jobs for each day and compares the total with the configured 8-hour daily reference." },
    ], nextSlug: "international-student-part-time-income-japan", nextLabel: "Plan your part-time income",
  },
  {
    locale: "ja", slug: "留学生-28時間", alternateSlug: "international-student-work-hours-japan",
    title: "留学生の週28時間アルバイト計算ツール｜ShiftWise Japan",
    description: "複数のアルバイトをまとめて計算。通常の授業期間の週28時間と、学校指定の長期休暇中の日別勤務時間を確認できる無料ツール。",
    h1: "留学生のアルバイト時間を自動計算", eyebrow: "無料の勤務時間計算ツール",
    intro: "掛け持ちしているアルバイトも一緒に入力できます。すべての勤務時間を合計し、選んだ学校期間に合う目安と比較します。", showCalculator: true,
    sections: [
      { heading: "掛け持ちの勤務時間をまとめて確認", paragraphs: ["勤務先ごとの時間だけでは、1週間全体の働き方がわかりません。仕事を別々に入力すると、ShiftWiseが自動で合計します。"], points: ["月曜から日曜までの週単位", "複数の仕事を合計", "通常期間と公式の長期休暇を区別"] },
      { heading: "通常期間と長期休暇は別の確認方法", paragraphs: ["通常の授業期間は、設定された一般的な週28時間の目安と比較します。学校が定める公式の長期休暇中は日ごとに入力し、すべての仕事を合わせた1日8時間の目安と比較します。週40時間を一律の上限として扱いません。"] },
    ],
    faqs: [
      { question: "アルバイトを掛け持ちしている場合も合計しますか？", answer: "はい。入力したすべての仕事を合計します。自分に適用される条件は、個別の許可内容と公式情報で確認してください。" },
      { question: "留学生なら誰でも週28時間まで働けますか？", answer: "いいえ。該当する在留資格と資格外活動許可の条件がある場合の一般的な目安です。" },
      { question: "長期休暇中はどう入力しますか？", answer: "日別に入力してください。同じ日の複数の仕事を合計し、設定された1日8時間の目安と比較します。" },
    ], nextSlug: "留学生-バイト-年収", nextLabel: "アルバイト年収の見通しを作る",
  },
  {
    locale: "en", slug: "international-student-part-time-income-japan", alternateSlug: "留学生-バイト-年収",
    title: "International Student Part-Time Income Japan | ShiftWise Japan",
    description: "Estimate full-year gross part-time income in Japan using your entered work history and projected remaining income.",
    h1: "Estimate Your Part-Time Income for the Year", eyebrow: "A clearer full-year outlook",
    intro: "Enter recent shifts and hourly pay to see income represented by your history, projected remaining income, and a full calendar-year gross estimate.", showCalculator: true,
    sections: [
      { heading: "See the parts behind the total", paragraphs: ["The main result is not only future income. It adds estimated income from your entered weeks, any other year-to-date gross income you provide, and projected income for the remaining weeks."] },
      { heading: "Keep the estimate grounded", paragraphs: ["ShiftWise uses an hours-weighted wage across your jobs. Quiet, likely, and busy scenarios show a range based on the selected school-period history, not a guarantee."] },
    ],
    faqs: [
      { question: "Is the main number a full-year estimate?", answer: "Yes. It is earned or estimated income so far plus projected remaining gross income for the same calendar year." },
      { question: "Does this calculate tax or take-home pay?", answer: "No. This MVP estimates gross income only and does not calculate tax or insurance." },
    ], nextSlug: "variable-shift-income-calculator-japan", nextLabel: "Understand variable-shift forecasting",
  },
  {
    locale: "ja", slug: "留学生-バイト-年収", alternateSlug: "international-student-part-time-income-japan",
    title: "留学生のアルバイト年収を予測｜ShiftWise Japan",
    description: "最近のシフトと時給から、これまでの推定収入、残り期間の収入予測、暦年の総収入見込みを確認できます。",
    h1: "留学生のアルバイト年収を見通す", eyebrow: "年間総収入をわかりやすく",
    intro: "最近の勤務時間と時給を入力すると、入力した週から推定した収入、残り期間の収入予測、暦年全体の総収入見込みを確認できます。", showCalculator: true,
    sections: [
      { heading: "合計額の内訳を確認", paragraphs: ["メインの結果は今後の収入だけではありません。入力した週から推定した収入、追加した今年の総収入、残り期間の予測を合計します。"] },
      { heading: "実際の働き方に近い予測", paragraphs: ["複数の仕事は勤務時間で加重した時給を使います。静かな場合・見込み・忙しい場合は幅を理解するための目安で、将来を保証するものではありません。"] },
    ],
    faqs: [
      { question: "表示される金額は年間の見込みですか？", answer: "はい。これまでの収入または推定額と、同じ暦年の残り期間の総収入予測を合計しています。" },
      { question: "税金や手取りも計算しますか？", answer: "いいえ。このMVPは総収入だけを予測し、税金や保険料は計算しません。" },
    ], nextSlug: "バイト-年収-予測", nextLabel: "変動シフトの予測方法を見る",
  },
  {
    locale: "en", slug: "international-student-long-vacation-work-japan", alternateSlug: "留学生-夏休み-バイト",
    title: "International Student Long-Vacation Work Japan | ShiftWise Japan",
    description: "Track daily hours across multiple jobs during an official school long vacation in Japan without assuming a universal 40-hour weekly limit.",
    h1: "Track Work During an Official School Vacation", eyebrow: "Daily tracking for long vacations",
    intro: "Choose official long-vacation mode and enter each shift by day. ShiftWise combines jobs for each date and shows the weekly total for context.", showCalculator: true,
    sections: [
      { heading: "Use your school's official period", paragraphs: ["This mode is for a long vacation designated by your educational institution. A personal week off or a gap between classes is not automatically the same."] },
      { heading: "Why daily entry matters", paragraphs: ["The configured general reference is 8 hours per day. Five 8-hour days total 40 hours, but ShiftWise does not label 40 hours as a universal weekly limit."] },
    ],
    faqs: [
      { question: "Can I enter two jobs on the same day?", answer: "Yes. Enter each job and the calculator combines them before the daily comparison." },
      { question: "Is every school break an official long vacation?", answer: "Not necessarily. Confirm the designated period with your educational institution." },
    ], nextSlug: "international-student-work-hours-japan", nextLabel: "Review normal-school work-hour tracking",
  },
  {
    locale: "ja", slug: "留学生-夏休み-バイト", alternateSlug: "international-student-long-vacation-work-japan",
    title: "留学生の夏休みアルバイト時間を確認｜ShiftWise Japan",
    description: "学校指定の公式な長期休暇中の勤務時間を日別に記録。掛け持ちも合計し、1日8時間の一般的な目安と比較します。",
    h1: "長期休暇中のアルバイト時間を日別に確認", eyebrow: "公式の長期休暇に対応",
    intro: "公式の長期休暇モードを選び、仕事ごとのシフトを日別に入力します。同じ日の掛け持ちを合計し、週合計も参考として表示します。", showCalculator: true,
    sections: [
      { heading: "学校が定めた長期休暇を選ぶ", paragraphs: ["このモードは、教育機関が定める公式な長期休暇のためのものです。個人的な休みや授業がない週と同じとは限りません。"] },
      { heading: "日別入力が必要な理由", paragraphs: ["設定された一般的な目安は1日8時間です。8時間を5日入力すると週合計は40時間になりますが、週40時間を一律の上限として表示しません。"] },
    ],
    faqs: [
      { question: "同じ日に二つのアルバイトを入力できますか？", answer: "はい。仕事ごとに入力し、日別に合計してから目安と比較します。" },
      { question: "授業がない週はすべて公式の長期休暇ですか？", answer: "必ずしもそうではありません。教育機関が指定した長期休暇か確認してください。" },
    ], nextSlug: "留学生-28時間", nextLabel: "通常期間の勤務時間を確認する",
  },
  {
    locale: "en", slug: "variable-shift-income-calculator-japan", alternateSlug: "バイト-年収-予測",
    title: "Variable Shift Income Calculator Japan | ShiftWise Japan",
    description: "Use changing weekly shifts to estimate quiet, most likely, and busy full-year gross income scenarios in Japan.",
    h1: "Forecast Income from Variable Shifts", eyebrow: "More useful than one average week",
    intro: "ShiftWise gives recent matching weeks more weight and keeps normal-semester history separate from official long-vacation history.", showCalculator: true,
    sections: [
      { heading: "Recent matching weeks matter more", paragraphs: ["The likely scenario weights the most recent four matching weeks at 60% and up to eight earlier matching weeks at 40%. Vacation weeks are not used for a normal-period forecast."] },
      { heading: "Use scenarios for planning", paragraphs: ["Quiet and busy scenarios are based on the lower and upper parts of your matching history. They describe possibilities, not guaranteed income."] },
    ],
    faqs: [
      { question: "Will a busy vacation inflate my semester forecast?", answer: "No. Normal and official long-vacation histories are kept separate." },
      { question: "What if there is no matching history?", answer: "The forecast shows that matching history is missing instead of borrowing weeks from the other period." },
    ], nextSlug: "international-student-part-time-income-japan", nextLabel: "Return to the full-year income guide",
  },
  {
    locale: "ja", slug: "バイト-年収-予測", alternateSlug: "variable-shift-income-calculator-japan",
    title: "変動シフトのバイト年収予測ツール｜ShiftWise Japan",
    description: "毎週変わるシフト履歴から、静かな場合・見込み・忙しい場合の年間総収入を予測します。",
    h1: "変動シフトからバイト年収を予測", eyebrow: "平均だけに頼らない見通し",
    intro: "同じ学校期間の最近の週を重く見ながら、通常期間と公式の長期休暇を分けて予測します。", showCalculator: true,
    sections: [
      { heading: "最近の同じ期間を重視", paragraphs: ["見込みシナリオは、同じ期間の直近4週間を60%、それ以前の最大8週間を40%として計算します。長期休暇の週は通常期間の予測に使いません。"] },
      { heading: "三つのシナリオで計画", paragraphs: ["静かな場合と忙しい場合は、該当する履歴の低い側と高い側をもとにしています。将来の収入を保証するものではありません。"] },
    ],
    faqs: [
      { question: "忙しい夏休みで通常期間の予測が上がりますか？", answer: "いいえ。通常期間と公式の長期休暇の履歴は分けて計算します。" },
      { question: "同じ期間の履歴がない場合は？", answer: "別の期間の週を代用せず、該当する履歴がないことを表示します。" },
    ], nextSlug: "留学生-バイト-年収", nextLabel: "年間収入の見通しに戻る",
  },
];

export const seoPages = pages;
export const getSeoPage = (locale: Locale, slug: string) => pages.find((page) => page.locale === locale && page.slug === slug);

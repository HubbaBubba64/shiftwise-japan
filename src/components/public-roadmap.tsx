"use client";

import { Check, FlaskConical, Sparkles, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocale } from "@/components/locale-provider";

const copy = {
  en: {
    eyebrow: "Built with students",
    title: "What's coming next",
    subtitle: "We're building BaitoPlan step by step based on what students actually need.",
    groups: [
      { title: "Available now", tone: "available", icon: Check, items: ["Variable shift tracking", "Income forecasting", "Multiple jobs", "Normal / long-vacation work tracking", "English and Japanese"] },
      { title: "Coming next", tone: "next", icon: Sparkles, items: ["Resident tax estimator", "National Health Insurance estimator", "Saved shift history", "More municipality support"] },
      { title: "Exploring", tone: "exploring", icon: FlaskConical, items: ["Payslip upload", "Shift calendar import", "Bill reminders"] },
    ],
    cta: "Help choose what we build next",
    modalTitle: "What would help you most?",
    modalBody: "Choose one idea for now. Voting is just a preview—we're not saving or sending your choice yet.",
    close: "Close",
    submit: "Choose this idea",
    thanks: "Thanks for helping shape BaitoPlan!",
    noted: "Your choice stays on this screen for now. A future version will connect it to real voting.",
  },
  ja: {
    eyebrow: "留学生と一緒につくる",
    title: "これから追加すること",
    subtitle: "留学生が本当に必要としていることを大切に、BaitoPlan（バイトプラン）を少しずつ育てています。",
    groups: [
      { title: "今できること", tone: "available", icon: Check, items: ["変動シフトの記録", "収入予測", "複数のアルバイト", "通常期間・長期休暇の勤務記録", "日本語と英語"] },
      { title: "次につくること", tone: "next", icon: Sparkles, items: ["住民税の目安", "国民健康保険料の目安", "シフト履歴の保存", "対応する自治体を増やす"] },
      { title: "検討していること", tone: "exploring", icon: FlaskConical, items: ["給与明細のアップロード", "シフトカレンダーの取り込み", "支払いリマインダー"] },
    ],
    cta: "次につくる機能を一緒に選ぶ",
    modalTitle: "どの機能がいちばん役立ちそうですか？",
    modalBody: "今はひとつ選んでみてください。この投票画面はプレビューのため、選択内容はまだ保存・送信されません。",
    close: "閉じる",
    submit: "この機能を選ぶ",
    thanks: "BaitoPlan（バイトプラン）づくりへのご協力、ありがとうございます！",
    noted: "今はこの画面内だけに選択が残ります。今後、実際の投票につなげる予定です。",
  },
} as const;

export function PublicRoadmap() {
  const { locale } = useLocale();
  const content = copy[locale];
  const [open, setOpen] = useState(false);
  const [choice, setChoice] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const closeButton = useRef<HTMLButtonElement>(null);
  const triggerButton = useRef<HTMLButtonElement>(null);
  const ideas = content.groups.slice(1).flatMap((group) => group.items);

  useEffect(() => {
    if (!open) return;
    closeButton.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeModal();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  function closeModal() {
    setOpen(false);
    setSubmitted(false);
    requestAnimationFrame(() => triggerButton.current?.focus());
  }

  return (
    <section className="roadmap shell" aria-labelledby="roadmap-title">
      <div className="roadmap-heading">
        <div>
          <p className="eyebrow"><span />{content.eyebrow}</p>
          <h2 id="roadmap-title">{content.title}</h2>
          <p>{content.subtitle}</p>
        </div>
        <button ref={triggerButton} className="button secondary roadmap-cta" type="button" onClick={() => setOpen(true)}>{content.cta}</button>
      </div>
      <div className="roadmap-grid">
        {content.groups.map(({ title, tone, icon: Icon, items }) => (
          <article className={`roadmap-card ${tone}`} key={title}>
            <h3><span><Icon size={16} /></span>{title}</h3>
            <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul>
          </article>
        ))}
      </div>

      {open && (
        <div className="vote-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && closeModal()}>
          <section className="vote-modal" role="dialog" aria-modal="true" aria-labelledby="vote-title">
            <button ref={closeButton} className="vote-close" type="button" onClick={closeModal} aria-label={content.close}><X size={19} /></button>
            {submitted ? (
              <div className="vote-thanks" role="status"><span><Check size={22} /></span><h2 id="vote-title">{content.thanks}</h2><p>{content.noted}</p><button className="button primary" type="button" onClick={closeModal}>{content.close}</button></div>
            ) : (
              <>
                <h2 id="vote-title">{content.modalTitle}</h2>
                <p>{content.modalBody}</p>
                <div className="vote-options">
                  {ideas.map((idea) => <label key={idea}><input type="radio" name="roadmap-vote" value={idea} checked={choice === idea} onChange={() => setChoice(idea)} /><span>{idea}</span></label>)}
                </div>
                <button className="button primary vote-submit" type="button" disabled={!choice} onClick={() => setSubmitted(true)}>{content.submit}</button>
              </>
            )}
          </section>
        </div>
      )}
    </section>
  );
}

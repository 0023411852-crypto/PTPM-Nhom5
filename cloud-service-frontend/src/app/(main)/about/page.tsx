import Link from "next/link";

const milestones = [
  { year: "2022", title: "Khởi đầu", text: "CloudNova bắt đầu với mục tiêu đơn giản hóa hạ tầng Cloud cho đội ngũ Việt Nam." },
  { year: "2023", title: "Ra mắt Cloud VPS", text: "Đưa máy chủ ảo hiệu năng cao, dễ triển khai đến gần hơn với startup và developer." },
  { year: "2024", title: "Mở rộng hệ sinh thái", text: "Bổ sung Hosting, Domain, Email doanh nghiệp và các lớp bảo mật thiết yếu." },
  { year: "2025", title: "Đồng hành doanh nghiệp", text: "Tập trung vào hạ tầng ổn định, hỗ trợ nhanh và giải pháp phù hợp từng quy mô." },
  { year: "2026", title: "Mở rộng tương lai", text: "Tiếp tục đầu tư vào tự động hóa, quan sát hệ thống và trải nghiệm khách hàng." },
];

const capabilities = [
  { icon: "cloud_queue", title: "Cloud platform", text: "Nền tảng linh hoạt cho VPS, Hosting, Domain và các dịch vụ hạ tầng thiết yếu." },
  { icon: "monitoring", title: "Vận hành minh bạch", text: "Theo dõi liên tục, thông tin rõ ràng và những chỉ số giúp bạn chủ động ra quyết định." },
  { icon: "groups", title: "Đồng hành dài hạn", text: "Tư vấn từ cấu hình ban đầu đến khi sản phẩm cần mở rộng quy mô." },
];

const securityFeatures = [
  { icon: "security", title: "DDoS Protection", text: "Chủ động phát hiện và giảm thiểu lưu lượng bất thường." },
  { icon: "wall_art", title: "Firewall", text: "Kiểm soát lớp truy cập với chính sách bảo vệ rõ ràng." },
  { icon: "lock", title: "SSL / TLS", text: "Mã hóa kết nối và tăng độ tin cậy cho mọi điểm chạm." },
  { icon: "backup", title: "Automated Backup", text: "Sẵn sàng khôi phục khi dữ liệu cần được bảo vệ thêm." },
  { icon: "monitoring", title: "Active Monitoring", text: "Theo dõi hạ tầng liên tục để giảm thời gian gián đoạn." },
  { icon: "admin_panel_settings", title: "Access Control", text: "Phân quyền và quản lý truy cập theo nhu cầu vận hành." },
];

const values = [
  { icon: "favorite", title: "Customer First", text: "Lợi ích của khách hàng luôn là ưu tiên trong mọi quyết định." },
  { icon: "lightbulb", title: "Innovation", text: "Không ngừng đổi mới để công nghệ trở nên dễ tiếp cận hơn." },
  { icon: "shield", title: "Reliability", text: "Cung cấp hệ thống ổn định để bạn an tâm phát triển." },
  { icon: "visibility", title: "Transparency", text: "Minh bạch trong vận hành, giá cả và giao tiếp." },
];

function Icon({ name, className = "" }: { name: string; className?: string }) {
  return <span className={`material-symbols-outlined ${className}`}>{name}</span>;
}

export default function AboutPage() {
  return (
    <main className="public-content about-page flex-grow pt-16 route-fade-in">
      <section className="about-hero relative overflow-hidden px-gutter">
        <div className="about-hero-orb about-hero-orb-one" aria-hidden="true" />
        <div className="about-hero-orb about-hero-orb-two" aria-hidden="true" />
        <div className="about-hero-grid" aria-hidden="true" />
        <div className="max-w-container-max mx-auto relative z-10 grid grid-cols-1 items-center gap-2xl py-3xl lg:grid-cols-[.92fr_1.08fr] lg:py-[7rem]">
          <div className="about-hero-copy" data-reveal>
            <div className="about-eyebrow inline-flex items-center gap-sm rounded-full border border-cyan-200/20 bg-white/10 px-md py-sm text-[length:var(--text-label-caps)] font-semibold uppercase tracking-[.14em] text-cyan-100">
              <span className="about-live-dot" /> Về CloudNova
            </div>
            <h1 className="mt-xl max-w-[48rem] font-display-lg text-display-lg text-white">
              Chúng tôi xây dựng hạ tầng cho <span className="about-gradient-text">những ý tưởng lớn.</span>
            </h1>
            <p className="mt-lg max-w-[42rem] font-body-lg text-body-lg leading-relaxed text-blue-100/75">
              CloudNova cung cấp nền tảng Cloud giúp cá nhân, startup và doanh nghiệp triển khai sản phẩm nhanh hơn, an toàn hơn và dễ dàng mở rộng hơn.
            </p>
            <div className="mt-xl flex flex-col gap-md sm:flex-row">
              <Link href="/services" className="about-primary-cta inline-flex items-center justify-center gap-sm rounded-xl bg-white px-lg py-md font-semibold text-[#0b4387] shadow-lg transition-transform">
                Khám phá dịch vụ <Icon name="arrow_forward" className="text-[18px]" />
              </Link>
              <a href="mailto:contact@cloudnova.vn" className="about-secondary-cta inline-flex items-center justify-center gap-sm rounded-xl border border-white/20 bg-white/10 px-lg py-md font-semibold text-white backdrop-blur transition-transform">
                Kết nối với chúng tôi <Icon name="north_east" className="text-[18px]" />
              </a>
            </div>
            <div className="mt-2xl flex flex-wrap gap-x-xl gap-y-md text-blue-100/70">
              <span className="inline-flex items-center gap-xs text-[length:var(--text-body-sm)]"><Icon name="verified" className="text-[17px] text-emerald-300" /> 99.9% SLA</span>
              <span className="inline-flex items-center gap-xs text-[length:var(--text-body-sm)]"><Icon name="support_agent" className="text-[17px] text-cyan-300" /> Hỗ trợ 24/7</span>
              <span className="inline-flex items-center gap-xs text-[length:var(--text-body-sm)]"><Icon name="bolt" className="text-[17px] text-amber-300" /> Triển khai nhanh</span>
            </div>
          </div>

          <div className="about-command-wrap" data-reveal>
            <div className="about-command-card">
              <div className="about-command-top flex items-center justify-between border-b border-white/10 px-lg py-md">
                <div className="flex items-center gap-sm">
                  <span className="about-window-dot bg-[#ff6b73]" /><span className="about-window-dot bg-[#ffc857]" /><span className="about-window-dot bg-[#64dca1]" />
                  <span className="ml-sm text-[length:var(--text-label-caps)] text-blue-100/55">cloudnova / ecosystem</span>
                </div>
                <span className="inline-flex items-center gap-xs text-[length:var(--text-label-caps)] text-emerald-300"><span className="about-status-dot" /> All systems operational</span>
              </div>
              <div className="grid gap-md p-lg sm:grid-cols-[1.15fr_.85fr]">
                <div className="about-architecture-panel rounded-2xl border border-white/10 p-lg">
                  <div className="flex items-center justify-between text-[length:var(--text-label-caps)] uppercase tracking-[.14em] text-blue-100/45"><span>Core infrastructure</span><Icon name="hub" className="text-cyan-300" /></div>
                  <div className="about-network-map mt-lg">
                    <span className="about-network-ring about-network-ring-one" /><span className="about-network-ring about-network-ring-two" />
                    <div className="about-network-center"><Icon name="cloud" className="text-[29px] text-cyan-200" /></div>
                    <span className="about-node about-node-one"><Icon name="dns" /></span><span className="about-node about-node-two"><Icon name="security" /></span><span className="about-node about-node-three"><Icon name="storage" /></span>
                    <span className="about-network-line about-network-line-one" /><span className="about-network-line about-network-line-two" /><span className="about-network-line about-network-line-three" />
                  </div>
                  <div className="mt-lg grid grid-cols-3 gap-sm text-center">
                    <div><strong className="block text-lg text-white">99.9%</strong><span className="text-[length:var(--text-label-caps)] text-blue-100/45">Uptime</span></div>
                    <div><strong className="block text-lg text-white">10Gbps</strong><span className="text-[length:var(--text-label-caps)] text-blue-100/45">Network</span></div>
                    <div><strong className="block text-lg text-white">24/7</strong><span className="text-[length:var(--text-label-caps)] text-blue-100/45">Support</span></div>
                  </div>
                </div>
                <div className="space-y-md">
                  <div className="about-mini-card"><Icon name="rocket_launch" className="text-cyan-300" /><div><span className="block text-[length:var(--text-label-caps)] text-blue-100/45">Deploy speed</span><strong className="text-white">5 phút</strong></div></div>
                  <div className="about-mini-card"><Icon name="shield_lock" className="text-emerald-300" /><div><span className="block text-[length:var(--text-label-caps)] text-blue-100/45">Protection</span><strong className="text-white">Multi-layer</strong></div></div>
                  <div className="about-mini-card"><Icon name="auto_graph" className="text-violet-300" /><div><span className="block text-[length:var(--text-label-caps)] text-blue-100/45">Ready to scale</span><strong className="text-white">Built for growth</strong></div></div>
                </div>
              </div>
            </div>
            <div className="about-float-badge about-float-badge-one"><Icon name="verified" className="text-emerald-300" /><span>Trusted infrastructure</span></div>
            <div className="about-float-badge about-float-badge-two"><Icon name="bolt" className="text-amber-300" /><span>Fast & reliable</span></div>
          </div>
        </div>
      </section>

      <section className="about-stat-strip px-gutter" data-reveal>
        <div className="mx-auto grid max-w-container-max grid-cols-2 divide-x divide-y divide-[#dbe7f4] overflow-hidden rounded-2xl border border-[#dbe7f4] bg-white shadow-[0_18px_45px_rgba(35,86,145,.1)] md:grid-cols-4 md:divide-y-0">
          {[{ icon: "verified", value: "99.9%", label: "Uptime cam kết" }, { icon: "language", value: "10Gbps", label: "Băng thông quốc tế" }, { icon: "support_agent", value: "24/7", label: "Hỗ trợ kỹ thuật" }, { icon: "rocket_launch", value: "5 phút", label: "Thời gian khởi tạo" }].map((stat) => (
            <div key={stat.label} className="about-stat-cell flex items-center gap-md px-lg py-lg md:px-xl">
              <span className="about-stat-icon"><Icon name={stat.icon} /></span><span><strong className="block text-xl font-bold text-[#133b6e]">{stat.value}</strong><span className="text-[length:var(--text-label-caps)] uppercase tracking-[.1em] text-[#7186a0]">{stat.label}</span></span>
            </div>
          ))}
        </div>
      </section>

      <section className="about-story-section px-gutter py-3xl">
        <div className="mx-auto grid max-w-container-max gap-2xl lg:grid-cols-[.75fr_1.25fr] lg:items-start">
          <div data-reveal>
            <span className="about-section-label">Câu chuyện CloudNova</span>
            <h2 className="mt-lg max-w-[34rem] font-headline-lg text-headline-lg text-[#102f58]">Từ một hạ tầng nhỏ đến nền tảng cho những bước tiến lớn.</h2>
            <p className="mt-lg max-w-[34rem] font-body-lg text-body-lg leading-relaxed text-on-surface-variant">Chúng tôi tin rằng công nghệ tốt không nên tạo thêm rào cản. CloudNova được xây dựng để đội ngũ có thể bắt đầu nhanh, vận hành rõ ràng và mở rộng tự tin.</p>
            <div className="about-story-note mt-xl flex gap-md rounded-2xl border border-[#dce9f7] bg-white p-lg shadow-sm"><Icon name="format_quote" className="text-3xl text-[#54bfe5]" /><p className="font-body-md text-body-md font-medium leading-relaxed text-[#335578]">“Hạ tầng tốt giúp đội ngũ tập trung vào điều quan trọng nhất: tạo ra sản phẩm có ích.”</p></div>
          </div>
          <div className="about-timeline" data-reveal>
            {milestones.map((milestone, index) => <div key={milestone.year} className="about-timeline-item"><div className="about-timeline-line" /><div className="about-timeline-dot">{index + 1}</div><div className="about-timeline-card"><span className="about-year">{milestone.year}</span><div><h3 className="font-headline-sm text-headline-sm text-[#143d70]">{milestone.title}</h3><p className="mt-xs font-body-sm text-body-sm leading-relaxed text-on-surface-variant">{milestone.text}</p></div></div></div>)}
          </div>
        </div>
      </section>

      <section className="about-capability-section bg-[#f3f8fe] px-gutter py-3xl">
        <div className="mx-auto max-w-container-max">
          <div className="text-center" data-reveal><span className="about-section-label">Năng lực cốt lõi</span><h2 className="mt-lg font-headline-lg text-headline-lg text-[#102f58]">Nền tảng được thiết kế cho tốc độ và sự an tâm.</h2><p className="mx-auto mt-md max-w-[42rem] font-body-lg text-body-lg text-on-surface-variant">Mỗi lớp dịch vụ đều hướng về một trải nghiệm vận hành đơn giản, minh bạch và đủ linh hoạt cho hành trình tăng trưởng.</p></div>
          <div className="mt-2xl grid grid-cols-1 gap-lg md:grid-cols-3">{capabilities.map((item, index) => <article key={item.title} className="about-capability-card interactive-card" data-reveal><span className="about-card-index">0{index + 1}</span><div className="about-capability-icon"><Icon name={item.icon} /></div><h3 className="mt-lg font-headline-md text-headline-md text-[#143d70]">{item.title}</h3><p className="mt-sm font-body-md text-body-md leading-relaxed text-on-surface-variant">{item.text}</p><span className="about-card-arrow"><Icon name="arrow_outward" /></span></article>)}</div>
        </div>
      </section>

      <section className="about-operations-section relative overflow-hidden bg-[#071b3b] px-gutter py-3xl text-white">
        <div className="about-operations-glow" aria-hidden="true" />
        <div className="relative z-10 mx-auto grid max-w-container-max gap-2xl lg:grid-cols-[.9fr_1.1fr] lg:items-center">
          <div data-reveal><span className="about-section-label about-section-label-dark">Operational excellence</span><h2 className="mt-lg font-headline-lg text-headline-lg">Hạ tầng được xây dựng để luôn sẵn sàng.</h2><p className="mt-lg max-w-[35rem] font-body-lg text-body-lg leading-relaxed text-blue-100/70">Từ hiệu năng đến bảo mật, CloudNova kết hợp những lớp vận hành quan trọng để hệ thống của bạn có một nền móng vững chắc.</p><Link href="/services" className="mt-xl inline-flex items-center gap-sm rounded-xl bg-[#6edaff] px-lg py-md font-semibold text-[#072b58] transition-transform hover:-translate-y-1">Xem hệ sinh thái dịch vụ <Icon name="arrow_forward" className="text-[18px]" /></Link></div>
          <div className="about-operations-card" data-reveal><div className="flex items-center justify-between border-b border-white/10 pb-lg"><div><span className="text-[length:var(--text-label-caps)] uppercase tracking-[.14em] text-blue-100/45">CloudNova score</span><strong className="mt-xs block text-3xl text-white">Excellent</strong></div><span className="about-score-ring">99</span></div><div className="mt-xl space-y-lg">{[{ label: "Infrastructure reliability", value: "99.9%", width: "99.9%" }, { label: "Network readiness", value: "98.4%", width: "98.4%" }, { label: "Security coverage", value: "96.8%", width: "96.8%" }].map((item) => <div key={item.label}><div className="mb-xs flex justify-between text-[length:var(--text-body-sm)]"><span className="text-blue-100/65">{item.label}</span><strong className="text-cyan-200">{item.value}</strong></div><div className="about-progress-track"><span style={{ width: item.width }} /></div></div>)}</div><div className="mt-xl grid grid-cols-2 gap-md"><div className="about-ops-chip"><Icon name="dns" className="text-cyan-300" /><span><strong className="block text-white">NVMe</strong><small className="text-blue-100/45">Performance layer</small></span></div><div className="about-ops-chip"><Icon name="shield_lock" className="text-emerald-300" /><span><strong className="block text-white">Protected</strong><small className="text-blue-100/45">Security layer</small></span></div></div></div>
        </div>
      </section>

      <section className="about-security-section px-gutter py-3xl">
        <div className="mx-auto max-w-container-max"><div className="flex flex-col justify-between gap-lg md:flex-row md:items-end" data-reveal><div><span className="about-section-label">Security by design</span><h2 className="mt-lg font-headline-lg text-headline-lg text-[#102f58]">Bảo mật là nền tảng.</h2><p className="mt-md max-w-[38rem] font-body-lg text-body-lg text-on-surface-variant">Từ lớp mạng đến quyền truy cập, mỗi thành phần đều được thiết kế để giảm rủi ro và tăng sự chủ động trong vận hành.</p></div><span className="about-security-badge"><Icon name="verified_user" /> Built-in protection</span></div><div className="mt-2xl grid grid-cols-1 gap-md sm:grid-cols-2 lg:grid-cols-3">{securityFeatures.map((item) => <div key={item.title} className="about-security-card" data-reveal><div className="about-security-icon"><Icon name={item.icon} /></div><div><h3 className="font-headline-sm text-headline-sm text-[#143d70]">{item.title}</h3><p className="mt-xs font-body-sm text-body-sm leading-relaxed text-on-surface-variant">{item.text}</p></div></div>)}</div></div>
      </section>

      <section className="about-values-section bg-[#f3f8fe] px-gutter py-3xl">
        <div className="mx-auto max-w-container-max"><div className="text-center" data-reveal><span className="about-section-label">Giá trị cốt lõi</span><h2 className="mt-lg font-headline-lg text-headline-lg text-[#102f58]">Công nghệ tốt bắt đầu từ cách chúng ta phục vụ.</h2></div><div className="mt-2xl grid grid-cols-1 gap-lg sm:grid-cols-2 lg:grid-cols-4">{values.map((item) => <div key={item.title} className="about-value-card" data-reveal><Icon name={item.icon} className="about-value-icon" /><h3 className="mt-lg font-headline-sm text-headline-sm text-[#143d70]">{item.title}</h3><p className="mt-sm font-body-sm text-body-sm leading-relaxed text-on-surface-variant">{item.text}</p></div>)}</div></div>
      </section>

      <section className="about-cta-section px-gutter py-3xl text-center"><div className="about-cta-card mx-auto max-w-container-max" data-reveal><div className="about-cta-orb" aria-hidden="true" /><div className="relative z-10"><span className="about-section-label about-section-label-dark">Sẵn sàng bắt đầu?</span><h2 className="mx-auto mt-lg max-w-[52rem] font-display-lg text-display-lg text-white">Hãy xây dựng sản phẩm tiếp theo cùng CloudNova.</h2><p className="mx-auto mt-lg max-w-[38rem] font-body-lg text-body-lg text-blue-100/70">Một nền tảng nhanh, an toàn và sẵn sàng mở rộng đang chờ bạn.</p><div className="mt-xl flex flex-col justify-center gap-md sm:flex-row"><Link href="/services" className="inline-flex items-center justify-center gap-sm rounded-xl bg-white px-xl py-md font-semibold text-[#0b4387] transition-transform hover:-translate-y-1">Khám phá dịch vụ <Icon name="arrow_forward" className="text-[18px]" /></Link><a href="mailto:contact@cloudnova.vn" className="inline-flex items-center justify-center gap-sm rounded-xl border border-white/20 bg-white/10 px-xl py-md font-semibold text-white transition-transform hover:-translate-y-1">Liên hệ với chúng tôi <Icon name="mail" className="text-[18px]" /></a></div></div></div></section>
    </main>
  );
}

import React from 'react';
import ProfileParticles from './ProfileParticles';
import './MemberProfile.css';

// --- 型定義にyoutubeを追加 ---
interface Member {
  name: string;
  icon: string;
  iconPosition?: string;
  jellyfish?: boolean;
  history?: string[];
  playTime?: string;
  links: {
    x?: string;
    vrchat?: string;
    note?: string;
    instagram?: string;
    youtube?: string; // YouTubeリンク用のプロパティを追加
  };
}

// --- 各SNSのアイコンを定義するコンポーネント ---
const SocialIcons: React.FC<{ links: Member['links'] }> = ({ links }) => {
  const iconData = {
    vrchat: {
      href: links.vrchat,
      path: (
        <>
          <path d="M3 3h18v13H10l-5 5v-5H3z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          <text x="12" y="12" textAnchor="middle" fontSize="7" fontWeight="700" fontFamily="sans-serif">VRC</text>
        </>
      ),
      fill: '#ffffff',
    },
    x: {
      href: links.x,
      path: (
        <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.931L18.901 1.153zm-1.613 19.57h2.592L5.413 2.54H2.69l14.598 18.183z" />
      ),
      fill: '#ffffff',
    },
    note: {
      href: links.note,
      path: (
        <>
          <circle cx="12" cy="12" r="11" />
          <path d="M10.7 15.6V9.8l-1.1.8V9l2.4-1.8h.8v7.4h-1.4z" fill="#fff" />
        </>
      ),
      fill: '#41C9B4',
    },
    instagram: {
      href: links.instagram,
      path: (
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.584-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.069-4.85.069s-3.584-.011-4.85-.069c-3.225-.149-4.771-1.664-4.919-4.919-.058-1.265-.069-1.644-.069-4.85s.011-3.584.069-4.85c.149-3.225 1.664-4.771 4.919-4.919.058-1.265.069-1.645.069-4.85zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.359 2.618 6.78 6.98 6.98 1.281.059 1.689.073 4.948.073s3.667-.014 4.947-.072c4.359-.2 6.78-2.618 6.98-6.98.059-1.281.073-1.689.073-4.948s-.014-3.667-.072-4.947c-.2-4.359-2.618-6.78-6.98-6.98-1.281-.059-1.689-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      ),
      fill: '#E1306C',
    },
    youtube: {
      href: links.youtube,
      path: (
        <path d="M21.582,6.186c-0.218-0.808-0.887-1.476-1.696-1.694C18.261,4,12,4,12,4S5.739,4,4.114,4.492c-0.809,0.218-1.478,0.886-1.696,1.694C2,7.811,2,12,2,12s0,4.189,0.418,5.814c0.218,0.808,0.887,1.476,1.696,1.694C5.739,20,12,20,12,20s6.261,0,7.886-0.492c0.809-0.218,1.478-0.886,1.696-1.694C22,16.189,22,12,22,12S22,7.811,21.582,6.186z M10,15.464V8.536L16,12L10,15.464z" />
      ),
      fill: '#FF0000',
    },
  };

  return (
    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
      {Object.entries(iconData).map(([key, { href, path, fill }]) =>
        href ? (
          <a
            key={key}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={key}
            style={{ display: 'inline-block', transition: 'transform 0.2s' }}
            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="32"
              height="32"
              fill={fill}
              style={{ color: fill }}
            >
              {path}
            </svg>
          </a>
        ) : null
      )}
    </div>
  );
};


// --- メインのコンポーネント ---
const MemberProfile: React.FC<{ member: Member }> = ({ member }) => {
  const [pinned, setPinned] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);
  const historyId = React.useId();
  return (
    <div style={{
      position: 'relative',
      overflow: 'visible',
      zIndex: pinned || hovered ? 2 : 0,
      isolation: 'isolate',
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      marginBottom: '2rem',
      padding: '1.5rem',
      borderRadius: '8px',
      background: 'rgba(255, 255, 255, 0.1)',
    }}>
      <ProfileParticles jellyfish={member.jellyfish} />
      <img src={member.icon} alt={`${member.name} icon`} style={{
        position: 'relative',
        zIndex: 1,
        flexShrink: 0,
        width: '100px',
        height: '100px',
        objectFit: member.iconPosition ? 'cover' : undefined,
        objectPosition: member.iconPosition,
        borderRadius: '50%',
        marginRight: '1.5rem',
      }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <h2 style={{ margin: 0, fontSize: '1.8rem' }}>{member.name}</h2>
        <SocialIcons links={member.links} />
      </div>
      <div
        className={`member-history${pinned || hovered ? ' is-open' : ''}`}
        onMouseEnter={() => { if (window.matchMedia('(hover: hover)').matches) setHovered(true); }}
        onMouseLeave={() => setHovered(false)}
      >
        <button
          type="button"
          className="member-history-trigger"
          aria-expanded={pinned || hovered}
          aria-controls={historyId}
          aria-label={`${member.name}の経歴を${pinned ? '閉じる' : '表示する'}`}
          onClick={() => setPinned(value => !value)}
          onKeyDown={event => { if (event.key === 'Escape') setPinned(false); }}
        >
          <span>経歴を見る</span>
        </button>
        <div id={historyId} className="member-history-details">
          {pinned && <button type="button" className="member-history-close"
            aria-label="経歴を閉じる" onClick={() => { setPinned(false); setHovered(false); }}>×</button>}
          <h3>{member.name}の経歴</h3>
          {member.history?.length ? (
            <>
              <ul>{member.history.map(entry => <li key={entry}>{entry}</li>)}</ul>
              {member.playTime && <p>プレイ時間：{member.playTime}</p>}
            </>
          ) : <p>経歴は準備中です。</p>}
        </div>
      </div>
    </div>
  );
};

export default MemberProfile;

import React, { useState } from 'react';
import {
  X,
  Lock,
  Youtube,
  Megaphone,
  Code,
  Users,
  Server,
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Copy,
  Sparkles,
  RotateCcw,
  Search,
  Download,
  FileText,
  Check,
} from 'lucide-react';
import { YouTubeVideo, createYouTubeVideo } from '../utils/youtube.ts';
import { PrivateAd, GoogleAdsConfig, approveAd, rejectAd, deleteAd } from '../utils/ads.ts';
import { SpiritualService } from '../data/services.ts';
import {
  validateServiceInput,
  createSpiritualService,
} from '../utils/serviceManagement.ts';
import { ConsultationLead } from './ConsultationForm.tsx';
import { translations, Language } from '../data/translations.ts';

interface AdminModalProps {
  lang: Language;
  isOpen: boolean;
  onClose: () => void;
  isAdminAuthenticated: boolean;
  onAuthenticate: (success: boolean) => void;
  videos: YouTubeVideo[];
  onAddVideo: (video: YouTubeVideo) => void;
  onDeleteVideo: (videoId: string) => void;
  services: SpiritualService[];
  onAddService: (service: SpiritualService) => void;
  onDeleteService: (serviceId: string) => void;
  onResetServices?: () => void;
  ads: PrivateAd[];
  onUpdateAds: (ads: PrivateAd[]) => void;
  googleAdsConfig: GoogleAdsConfig;
  onUpdateGoogleAds: (config: GoogleAdsConfig) => void;
  leads: ConsultationLead[];
  initialTab?: 'videos' | 'services' | 'ads' | 'googleAds' | 'leads' | 'bigrock';
}

export const AdminModal: React.FC<AdminModalProps> = ({
  lang,
  isOpen,
  onClose,
  isAdminAuthenticated,
  onAuthenticate,
  videos,
  onAddVideo,
  onDeleteVideo,
  services,
  onAddService,
  onDeleteService,
  onResetServices,
  ads,
  onUpdateAds,
  googleAdsConfig,
  onUpdateGoogleAds,
  leads,
  initialTab = 'videos',
}) => {
  const [activeTab, setActiveTab] = useState<'videos' | 'services' | 'ads' | 'googleAds' | 'leads' | 'bigrock'>(initialTab);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // Sync initialTab when changed
  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Video Form State
  const [videoUrl, setVideoUrl] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  const [videoCategory, setVideoCategory] = useState('Naturopathy & Vitality');
  const [videoError, setVideoError] = useState('');
  const [videoSuccess, setVideoSuccess] = useState('');

  // Service Form & Management State
  const [svcCategory, setSvcCategory] = useState<'tantra' | 'herbal' | 'relationship' | 'astrology'>('tantra');
  const [svcIcon, setSvcIcon] = useState('Flame');
  const [svcTitleTe, setSvcTitleTe] = useState('');
  const [svcTitleEn, setSvcTitleEn] = useState('');
  const [svcShortDescTe, setSvcShortDescTe] = useState('');
  const [svcShortDescEn, setSvcShortDescEn] = useState('');
  const [svcRemedyTe, setSvcRemedyTe] = useState('');
  const [svcRemedyEn, setSvcRemedyEn] = useState('');
  const [svcFullDescTe, setSvcFullDescTe] = useState('');
  const [svcBadgeTe, setSvcBadgeTe] = useState('శీఘ్ర ఫలితం');
  const [svcError, setSvcError] = useState('');
  const [svcSuccess, setSvcSuccess] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [svcSearch, setSvcSearch] = useState('');
  const [svcFilterCat, setSvcFilterCat] = useState<'all' | 'tantra' | 'herbal' | 'relationship' | 'astrology'>('all');

  // Google Ads Form State
  const [gAdsEnabled, setGAdsEnabled] = useState(googleAdsConfig.enabled);
  const [gAdsClient, setGAdsClient] = useState(googleAdsConfig.adClient);
  const [gAdsSlot, setGAdsSlot] = useState(googleAdsConfig.adSlotBanner);
  const [gAdsSnippet, setGAdsSnippet] = useState(googleAdsConfig.customHtmlSnippet || '');
  const [gAdsSaved, setGAdsSaved] = useState(false);

  // Hostinger & cPanel Copy Status
  const [copiedHtaccess, setCopiedHtaccess] = useState(false);
  const [copiedRobots, setCopiedRobots] = useState(false);
  const [copiedSitemap, setCopiedSitemap] = useState(false);
  const [copiedGuide, setCopiedGuide] = useState(false);

  const t = translations[lang];

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const entered = pinInput.trim();
    if (entered === '1977' || entered === 'srinivas1977') {
      onAuthenticate(true);
      setPinError(false);
      setPinInput('');
    } else {
      setPinError(true);
    }
  };

  const handleAddVideoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setVideoError('');
    setVideoSuccess('');

    try {
      const newVid = createYouTubeVideo({
        url: videoUrl,
        title: videoTitle || 'సద్గురు నాటు వైద్యం - యూట్యూబ్ వీడియో',
        titleTe: videoTitle || 'సద్గురు నాటు వైద్యం - యూట్యూబ్ వీడియో',
        category: videoCategory,
        categoryTe: videoCategory,
        featured: true,
      });

      onAddVideo(newVid);
      setVideoSuccess(
        lang === 'te'
          ? 'వీడియో విజయవంతంగా జోడించబడింది! ఇది మొదటి (1st) స్థానంలో ప్రదర్శించబడుతుంది.'
          : 'Video added successfully! It is now positioned 1st on the website.'
      );
      setVideoUrl('');
      setVideoTitle('');
    } catch (err: any) {
      setVideoError(
        lang === 'te'
          ? 'చెల్లుబాటు అయ్యే యూట్యూబ్ లింక్ నమోదు చేయండి.'
          : 'Please enter a valid YouTube video URL or ID.'
      );
    }
  };

  const handleApproveAd = (id: string) => {
    const updated = approveAd(ads, id);
    onUpdateAds(updated);
  };

  const handleRejectAd = (id: string) => {
    const updated = rejectAd(ads, id);
    onUpdateAds(updated);
  };

  const handleDeleteAd = (id: string) => {
    const updated = deleteAd(ads, id);
    onUpdateAds(updated);
  };

  const handleAddServiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSvcError('');
    setSvcSuccess('');

    const validation = validateServiceInput({
      category: svcCategory,
      titleTe: svcTitleTe,
      titleEn: svcTitleEn,
      shortDescTe: svcShortDescTe,
      shortDescEn: svcShortDescEn,
      fullDescTe: svcFullDescTe,
      remedyTe: svcRemedyTe,
      remedyEn: svcRemedyEn,
      badgeTe: svcBadgeTe,
      iconName: svcIcon,
    });

    if (!validation.valid) {
      setSvcError(validation.error || 'దయచేసి అవసరమైన వివరాలు పూరించండి.');
      return;
    }

    const newService = createSpiritualService({
      category: svcCategory,
      titleTe: svcTitleTe,
      titleEn: svcTitleEn,
      shortDescTe: svcShortDescTe,
      shortDescEn: svcShortDescEn,
      fullDescTe: svcFullDescTe,
      remedyTe: svcRemedyTe,
      remedyEn: svcRemedyEn,
      badgeTe: svcBadgeTe,
      iconName: svcIcon,
    });

    onAddService(newService);
    setSvcSuccess(
      lang === 'te'
        ? `"${newService.titleTe}" సేవ విజయవంతంగా జోడించబడింది! వెబ్‌సైట్‌లో #1 స్థానంలో దర్శనమిస్తుంది.`
        : `"${newService.titleEn}" service added successfully! It is now live at #1 position on the website.`
    );

    // Reset input fields
    setSvcTitleTe('');
    setSvcTitleEn('');
    setSvcShortDescTe('');
    setSvcShortDescEn('');
    setSvcRemedyTe('');
    setSvcRemedyEn('');
    setSvcFullDescTe('');
  };

  const handleDeleteServiceConfirmed = (serviceId: string) => {
    onDeleteService(serviceId);
    setDeleteConfirmId(null);
    setSvcSuccess(
      lang === 'te'
        ? 'సేవ విజయవంతంగా తొలగించబడింది.'
        : 'Service removed successfully.'
    );
  };

  const handleResetDefaultServices = () => {
    if (onResetServices) {
      onResetServices();
      setDeleteConfirmId(null);
      setSvcSuccess(
        lang === 'te'
          ? 'అన్ని ప్రాథమిక (డిఫాల్ట్ 19) సేవలు విజయవంతంగా పునరుద్ధరించబడ్డాయి.'
          : 'All default spiritual services have been successfully restored.'
      );
    }
  };

  const handleSaveGoogleAds = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateGoogleAds({
      enabled: gAdsEnabled,
      adClient: gAdsClient.trim(),
      adSlotBanner: gAdsSlot.trim(),
      customHtmlSnippet: gAdsSnippet.trim(),
    });
    setGAdsSaved(true);
    setTimeout(() => setGAdsSaved(false), 2000);
  };

  const downloadTextFile = (filename: string, content: string, mimeType = 'text/plain') => {
    const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const htaccessCode = `# ==============================================================================
# Hostinger (LiteSpeed & Apache) Production Configuration
# Optimized for Single-Page Applications (SPA), Fast Caching & Security
# ==============================================================================

# 1. Force UTF-8 Encoding
AddDefaultCharset UTF-8
DefaultLanguage te

# 2. Prevent Directory Browsing
Options -Indexes

# 3. Block Access to Hidden & Sensitive Files (.env, .git, etc.)
<FilesMatch "^\\.">
  <IfModule mod_authz_core.c>
    Require all denied
  </IfModule>
  <IfModule !mod_authz_core.c>
    Order allow,deny
    Deny from all
  </IfModule>
</FilesMatch>

# Allow access to robots.txt & sitemap.xml
<Files "robots.txt">
  <IfModule mod_authz_core.c>
    Require all granted
  </IfModule>
</Files>
<Files "sitemap.xml">
  <IfModule mod_authz_core.c>
    Require all granted
  </IfModule>
</Files>

# 4. HTTPS Redirection & SPA Routing (LiteSpeed / Apache)
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /

  # Automatically redirect HTTP to HTTPS on Hostinger
  RewriteCond %{HTTPS} off
  RewriteCond %{HTTP:X-Forwarded-Proto} !https
  RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

  # Don't rewrite existing files or directories
  RewriteRule ^index\\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]

  # Fallback to index.html for Single Page Routing
  RewriteRule ^ /index.html [L]
</IfModule>

# 5. Gzip & Deflate Compression (LiteSpeed / Apache)
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json image/svg+xml font/woff2
</IfModule>

# 6. Browser Caching
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresDefault "access plus 1 month"
  ExpiresByType text/html "access plus 1 hour"
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType font/woff2 "access plus 1 year"
</IfModule>

# 7. Security Headers
<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-XSS-Protection "1; mode=block"
  Header set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>
`;

  const robotsCode = `User-agent: *
Allow: /

# Hostinger Crawlers & Verification
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

# XML Sitemap
Sitemap: https://sadgurunatuvaidyam.com/sitemap.xml
`;

  const sitemapCode = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>https://sadgurunatuvaidyam.com/</loc>
    <lastmod>2026-10-28</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="te" href="https://sadgurunatuvaidyam.com/?lang=te" />
    <xhtml:link rel="alternate" hreflang="en" href="https://sadgurunatuvaidyam.com/?lang=en" />
  </url>
  <url>
    <loc>https://sadgurunatuvaidyam.com/#services</loc>
    <lastmod>2026-10-28</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://sadgurunatuvaidyam.com/#videos</loc>
    <lastmod>2026-10-28</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://sadgurunatuvaidyam.com/#yantras</loc>
    <lastmod>2026-10-28</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://sadgurunatuvaidyam.com/#private-ads</loc>
    <lastmod>2026-10-28</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://sadgurunatuvaidyam.com/#consultation</loc>
    <lastmod>2026-10-28</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
`;

  const hostingerGuideText = `================================================================================
HOSTINGER UPLOAD & SETUP GUIDE (తెలుగు & ENGLISH)
Sadguru Natu Vaidyam & Tantra Centre (శ్రీనివాస్ మహారాజ్)
================================================================================

[TELUGU / తెలుగు వివరణ]
ఈ ఫోల్డర్‌లో Hostinger లో వెబ్‌సైట్ అప్‌లోడ్ చేయడానికి అవసరమైన అన్ని ఫైల్స్ ఉన్నాయి:
1. index.html   -> ప్రొడక్షన్ వెబ్‌సైట్ (24 సేవలు, యూట్యూబ్ ఛానల్ లింక్, ప్రైవేట్ యాడ్స్, యంత్రాలు)
2. assets/      -> అప్లికేషన్ స్టైల్స్ & కోడ్ స్క్రిప్ట్‌లు
3. .htaccess    -> Hostinger LiteSpeed సర్వర్ కోసం HTTPS రీడైరెక్ట్, ఫాస్ట్ క్యాషింగ్ & రక్షణ ఫైల్
4. robots.txt   -> గూగుల్ సెర్చ్‌లో వెబ్‌సైట్ త్వరగా ర్యాంక్ అవ్వడానికి
5. sitemap.xml  -> వెబ్‌సైట్ పేజీలు & సెక్షన్ల లింకుల సైట్‌మ్యాప్

HOSTINGER లో అప్‌లోడ్ చేసే విధానం (5 సులువైన స్టెప్స్):
--------------------------------------------------------------------------------
స్టెప్ 1: మీ Hostinger ఖాతాలో లాగిన్ అవ్వండి: https://hpanel.hostinger.com
స్టెప్ 2: ఎడమ వైపు ఉన్న 'Websites' పై క్లిక్ చేసి, మీ డొమైన్ పక్కన ఉన్న 'Manage' బటన్ నొక్కండి.
స్టెప్ 3: 'File Manager' (ఫైల్ మేనేజర్) ఓపెన్ చేయండి.
స్టెప్ 4: అక్కడ 'public_html' అనే ఫోల్డర్ కనిపిస్తుంది. దానిపై డబుల్ క్లిక్ చేసి ఓపెన్ చేయండి.
         (గమనిక: ఒకవేళ అక్కడ పాత డెమో default.php లేదా ఫైల్స్ ఉంటే వాటిని డిలీట్ చేయవచ్చు).
స్టెప్ 5: పైన ఉన్న 'Upload' బటన్ నొక్కి, hostinger-deploy.zip ను అప్‌లోడ్ చేసి 'Extract' చేయండి.
         లేదా index.html, assets, .htaccess, robots.txt, sitemap.xml ఫైల్స్‌ను నేరుగా public_html లోకి అప్‌లోడ్ చేయండి.

వెంటనే మీ వెబ్‌సైట్ Hostinger లో లైవ్ అవుతుంది! ఎటువంటి Node.js కమాండ్లు అవసరం లేదు.
అడ్మిన్ పిన్: 1977

================================================================================
[ENGLISH INSTRUCTIONS]
Files provided for Hostinger:
1. index.html   -> Production SPA website (all 24 services, video gallery, ads, yantras)
2. assets/      -> Production CSS & JavaScript bundles
3. .htaccess    -> Production LiteSpeed/Apache config with SSL redirect, GZIP compression & SPA routing
4. robots.txt   -> Directs Google and Bing search crawlers
5. sitemap.xml  -> Search engine sitemap

HOW TO UPLOAD TO HOSTINGER HPANEL (5 Simple Steps):
--------------------------------------------------------------------------------
Step 1: Log in to your Hostinger hPanel dashboard (https://hpanel.hostinger.com)
Step 2: Go to 'Websites' and click 'Manage' next to your domain name.
Step 3: Click 'File Manager' under the Files section.
Step 4: Double-click and open the 'public_html' folder.
Step 5: Click the 'Upload' button (arrow icon at top right) and upload hostinger-deploy.zip,
        then right-click -> Extract into public_html.
        (Or upload index.html, assets folder, .htaccess, robots.txt, and sitemap.xml).

Your website is now 100% live on Hostinger with fast LiteSpeed caching and SSL enabled!
Admin PIN: 1977
================================================================================
`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-4xl bg-[#140b07] border border-amber-800/80 rounded-2xl shadow-2xl text-amber-100 max-h-[92vh] flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-amber-900/40 bg-[#1c100a] shrink-0">
          <div className="flex items-center gap-2.5">
            <Lock className="w-5 h-5 text-amber-400" />
            <h3 className="text-base sm:text-lg font-bold font-serif text-amber-100">
              {t.admin.title}
            </h3>
          </div>
          <div className="flex items-center gap-3">
            {isAdminAuthenticated && (
              <button
                onClick={() => onAuthenticate(false)}
                className="text-xs text-amber-400 hover:text-white px-2.5 py-1 rounded border border-amber-800 bg-amber-950/60"
              >
                {t.admin.logoutBtn}
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-amber-400 hover:text-white rounded-lg hover:bg-amber-900/40"
              aria-label="Close admin modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Authentication Form if Not Authenticated */}
        {!isAdminAuthenticated ? (
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center max-w-md mx-auto">
            <div className="w-14 h-14 rounded-full bg-amber-950/80 border border-amber-700/60 flex items-center justify-center text-amber-400 mb-4">
              <Lock className="w-7 h-7" />
            </div>
            <h4 className="text-xl font-bold font-serif text-amber-100 mb-1">
              {t.admin.loginTitle}
            </h4>
            <p className="text-xs text-amber-300/80 mb-6">
              {lang === 'te'
                ? 'అడ్మిన్ పోర్టల్ తెరవడానికి మీ రహస్య పాస్‌వర్డ్‌ను నమోదు చేయండి'
                : 'Please enter your confidential Admin password to continue'}
            </p>

            <form onSubmit={handleLogin} className="w-full flex flex-col gap-3">
              <input
                type="password"
                placeholder={t.admin.enterPin}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className="w-full px-4 py-3 bg-[#0d0704] border border-amber-800/80 rounded-xl text-center text-base tracking-widest text-amber-100 focus:outline-none focus:border-amber-400 font-mono"
              />

              {pinError && (
                <div className="text-xs text-red-400">
                  {lang === 'te' ? 'తప్పు పాస్వర్డ్! దయచేసి మళ్లీ ప్రయత్నించండి.' : 'Invalid password, please try again.'}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm rounded-xl transition-colors shadow-lg"
              >
                {t.admin.loginBtn}
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Navigation Tabs (Functional buttons, clean segmented design) */}
            <div className="flex items-center gap-1 px-6 py-2.5 border-b border-amber-900/40 bg-[#120a06] overflow-x-auto shrink-0 scrollbar-none">
              <button
                onClick={() => setActiveTab('videos')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeTab === 'videos'
                    ? 'bg-red-600 text-white'
                    : 'text-amber-300 hover:text-white'
                }`}
              >
                <Youtube className="w-3.5 h-3.5" />
                <span>{t.admin.tabs.videos} ({videos.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('services')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeTab === 'services'
                    ? 'bg-amber-500 text-stone-950 font-bold'
                    : 'text-amber-300 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t.admin.tabs.services} ({services.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('ads')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeTab === 'ads'
                    ? 'bg-amber-500 text-stone-950'
                    : 'text-amber-300 hover:text-white'
                }`}
              >
                <Megaphone className="w-3.5 h-3.5" />
                <span>
                  {t.admin.tabs.ads} (
                  {ads.filter((a) => a.status === 'pending').length} pending)
                </span>
              </button>

              <button
                onClick={() => setActiveTab('googleAds')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeTab === 'googleAds'
                    ? 'bg-amber-500 text-stone-950'
                    : 'text-amber-300 hover:text-white'
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                <span>{t.admin.tabs.googleAds}</span>
              </button>

              <button
                onClick={() => setActiveTab('leads')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeTab === 'leads'
                    ? 'bg-amber-500 text-stone-950'
                    : 'text-amber-300 hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>{t.admin.tabs.leads} ({leads.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('bigrock')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeTab === 'bigrock'
                    ? 'bg-amber-500 text-stone-950'
                    : 'text-amber-300 hover:text-white'
                }`}
              >
                <Server className="w-3.5 h-3.5" />
                <span>{t.admin.tabs.bigrock}</span>
              </button>
            </div>

            {/* Tab Body */}
            <div className="flex-1 overflow-y-auto p-6 text-sm">
              {/* TAB 1: VIDEOS */}
              {activeTab === 'videos' && (
                <div className="flex flex-col gap-6">
                  <div className="bg-[#180e08] p-5 rounded-xl border border-amber-900/50">
                    <h4 className="text-sm font-bold text-amber-200 mb-3 flex items-center gap-2">
                      <Plus className="w-4 h-4 text-red-500" />
                      <span>
                        {lang === 'te'
                          ? 'కొత్త యూట్యూబ్ వీడియో లింక్ జోడించండి (1st స్థానంలో కనిపిస్తుంది)'
                          : 'Add New YouTube Video (Automatically placed 1st)'}
                      </span>
                    </h4>

                    <form onSubmit={handleAddVideoSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-3">
                      <div className="md:col-span-5">
                        <input
                          type="text"
                          required
                          placeholder="Paste YouTube Link (https://youtu.be/...)"
                          value={videoUrl}
                          onChange={(e) => setVideoUrl(e.target.value)}
                          className="w-full px-3 py-2 bg-[#0e0704] border border-amber-800/60 rounded-lg text-xs text-amber-100 font-mono focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div className="md:col-span-4">
                        <input
                          type="text"
                          placeholder="Video Title / శీర్షిక"
                          value={videoTitle}
                          onChange={(e) => setVideoTitle(e.target.value)}
                          className="w-full px-3 py-2 bg-[#0e0704] border border-amber-800/60 rounded-lg text-xs text-amber-100 focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div className="md:col-span-3">
                        <button
                          type="submit"
                          className="w-full py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-lg transition-colors whitespace-nowrap shadow-md"
                        >
                          {lang === 'te' ? '+ 1st గా జోడించండి' : '+ Prepend (1st)'}
                        </button>
                      </div>
                    </form>

                    {videoError && <p className="mt-2 text-xs text-red-400">{videoError}</p>}
                    {videoSuccess && <p className="mt-2 text-xs text-emerald-400">{videoSuccess}</p>}
                  </div>

                  {/* List of current videos */}
                  <div>
                    <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-3">
                      {lang === 'te' ? 'ప్రస్తుత వీడియోల జాబితా (మొదటి నుండి వరుసగా)' : 'Active Video Queue'}
                    </h4>
                    <div className="flex flex-col gap-2">
                      {videos.map((vid, index) => (
                        <div
                          key={vid.id}
                          className="flex items-center justify-between p-3 bg-[#110905] border border-amber-900/40 rounded-xl gap-4"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="text-xs font-mono font-bold text-amber-500 w-6 shrink-0">
                              #{index + 1}
                            </span>
                            <img
                              src={vid.thumbnailUrl}
                              alt=""
                              className="w-14 h-9 object-cover rounded bg-stone-900 shrink-0"
                            />
                            <div className="min-w-0">
                              <div className="text-xs font-semibold text-amber-100 truncate">
                                {vid.title}
                              </div>
                              <div className="text-[11px] text-amber-400/80 font-mono">
                                ID: {vid.youtubeId} · {vid.category}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <a
                              href={`https://www.youtube.com/watch?v=${vid.youtubeId}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 text-amber-400 hover:text-white rounded hover:bg-amber-900/30"
                              title="Open in YouTube"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                            <button
                              onClick={() => onDeleteVideo(vid.id)}
                              className="p-1.5 text-red-400 hover:text-red-200 rounded hover:bg-red-950/60"
                              title="Delete video"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: SPIRITUAL & HERBAL SERVICES MANAGEMENT */}
              {activeTab === 'services' && (
                <div className="flex flex-col gap-6">
                  {/* Top Notice */}
                  <div className="text-xs text-amber-300/90 bg-[#180e08] p-3.5 rounded-xl border border-amber-900/40 flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-amber-200 mb-1">
                        {lang === 'te'
                          ? 'సేవల జోడింపు మరియు తొలగింపు నిర్వహణ (Manage Spiritual Services)'
                          : 'Add, edit, or remove services from the website catalog'}
                      </p>
                      <p className="text-amber-300/70">
                        {lang === 'te'
                          ? 'మీరు ఇక్కడ కొత్త సేవను జోడిస్తే, అది వెంటనే వెబ్‌సైట్ సేవలు విభాగంలో మరియు కన్సల్టేషన్ ఫారమ్‌లో మొదటి స్థానంలో దర్శనమిస్తుంది.'
                          : 'Newly created services immediately appear at #1 position in the Services section and in consultation forms.'}
                      </p>
                    </div>
                    {onResetServices && (
                      <button
                        type="button"
                        onClick={handleResetDefaultServices}
                        className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-700/60 bg-amber-950/80 text-amber-300 hover:text-white hover:bg-amber-900 text-xs font-medium transition-colors"
                        title="Reset services to initial 19 defaults"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>{lang === 'te' ? 'డిఫాల్ట్ పునరుద్ధరణ' : 'Restore Defaults'}</span>
                      </button>
                    )}
                  </div>

                  {/* Feedback Alerts */}
                  {svcSuccess && (
                    <div className="flex items-center gap-2 p-3 bg-emerald-950/80 border border-emerald-700/60 rounded-xl text-emerald-300 text-xs animate-in fade-in">
                      <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
                      <span>{svcSuccess}</span>
                    </div>
                  )}

                  {svcError && (
                    <div className="flex items-center gap-2 p-3 bg-red-950/80 border border-red-700/60 rounded-xl text-red-300 text-xs">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                      <span>{svcError}</span>
                    </div>
                  )}

                  {/* Form: Add New Service */}
                  <div className="bg-[#180e08] p-5 rounded-2xl border border-amber-900/50">
                    <h4 className="text-sm font-bold font-serif text-amber-200 mb-3 flex items-center gap-2">
                      <Plus className="w-4 h-4 text-amber-400" />
                      <span>
                        {lang === 'te'
                          ? 'కొత్త సేవ లేదా పరిహారం జోడించండి (Add New Service)'
                          : 'Add New Spiritual / Herbal Remedy Service'}
                      </span>
                    </h4>

                    <form onSubmit={handleAddServiceSubmit} className="flex flex-col gap-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Category Dropdown */}
                        <div>
                          <label className="block text-xs font-semibold text-amber-300 mb-1">
                            {lang === 'te' ? 'విభాగం (Category) *' : 'Category *'}
                          </label>
                          <select
                            value={svcCategory}
                            onChange={(e) => setSvcCategory(e.target.value as any)}
                            className="w-full px-3.5 py-2.5 bg-[#0d0704] border border-amber-900/60 rounded-xl text-xs text-amber-100 focus:outline-none focus:border-amber-400"
                          >
                            <option value="tantra">తంత్ర & వశీకరణ (Tantra & Vashikaran)</option>
                            <option value="herbal">నాటు వైద్యం & మూలికలు (Herbal & Naturopathy)</option>
                            <option value="relationship">కుటుంబం & సంబంధాలు (Marital & Relationships)</option>
                            <option value="astrology">గ్రహ దోషాలు & జ్యోతిష్యం (Astrology & Dosha)</option>
                          </select>
                        </div>

                        {/* Icon Dropdown */}
                        <div>
                          <label className="block text-xs font-semibold text-amber-300 mb-1">
                            {lang === 'te' ? 'చిహ్నం (Icon)' : 'Icon'}
                          </label>
                          <select
                            value={svcIcon}
                            onChange={(e) => setSvcIcon(e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-[#0d0704] border border-amber-900/60 rounded-xl text-xs text-amber-100 focus:outline-none focus:border-amber-400"
                          >
                            <option value="Flame">🔥 Flame (అగ్ని / తంత్రం)</option>
                            <option value="HeartHandshake">🤝 HeartHandshake (బంధాలు / శాంతి)</option>
                            <option value="ShieldCheck">🛡️ ShieldCheck (రక్షణ / నివారణ)</option>
                            <option value="Leaf">🌿 Leaf (నాటు వైద్యం / మూలిక)</option>
                            <option value="Coins">💰 Coins (ధన ఆకర్షణ / కుబేర)</option>
                            <option value="Briefcase">💼 Briefcase (వ్యాపార వృద్ధి)</option>
                            <option value="Sparkles">✨ Sparkles (దివ్య శక్తులు)</option>
                            <option value="Compass">🧭 Compass (వాస్తు / దిశ)</option>
                          </select>
                        </div>

                        {/* Telugu Title */}
                        <div>
                          <label className="block text-xs font-semibold text-amber-300 mb-1">
                            {lang === 'te' ? 'సేవ శీర్షిక (తెలుగులో) *' : 'Service Title (Telugu) *'}
                          </label>
                          <input
                            type="text"
                            placeholder="ఉదా: శత్రు సంహార పూజ & నరదిష్టి నివారణ"
                            value={svcTitleTe}
                            onChange={(e) => setSvcTitleTe(e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-[#0d0704] border border-amber-900/60 rounded-xl text-xs text-amber-100 focus:outline-none focus:border-amber-400"
                            required
                          />
                        </div>

                        {/* English Title */}
                        <div>
                          <label className="block text-xs font-semibold text-amber-300 mb-1">
                            {lang === 'te' ? 'సేవ శీర్షిక (ఇంగ్లీష్ లో - ఐచ్ఛికం)' : 'Service Title (English - Optional)'}
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Enemy Protection & Nazar Nivaran"
                            value={svcTitleEn}
                            onChange={(e) => setSvcTitleEn(e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-[#0d0704] border border-amber-900/60 rounded-xl text-xs text-amber-100 focus:outline-none focus:border-amber-400"
                          />
                        </div>

                        {/* Short Description Telugu */}
                        <div>
                          <label className="block text-xs font-semibold text-amber-300 mb-1">
                            {lang === 'te' ? 'సంక్షిప్త వివరణ (కార్డ్ లో కనిపించేలా) *' : 'Short Description (Telugu) *'}
                          </label>
                          <input
                            type="text"
                            placeholder="ఉదా: అసూయ, శత్రు బాధలు, వ్యాపార ఆటంకాలను సంపూర్ణంగా తొలగించడం."
                            value={svcShortDescTe}
                            onChange={(e) => setSvcShortDescTe(e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-[#0d0704] border border-amber-900/60 rounded-xl text-xs text-amber-100 focus:outline-none focus:border-amber-400"
                            required
                          />
                        </div>

                        {/* Short Description English */}
                        <div>
                          <label className="block text-xs font-semibold text-amber-300 mb-1">
                            {lang === 'te' ? 'Short Description (English)' : 'Short Description (English)'}
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Complete removal of jealousy and enemy obstacles."
                            value={svcShortDescEn}
                            onChange={(e) => setSvcShortDescEn(e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-[#0d0704] border border-amber-900/60 rounded-xl text-xs text-amber-100 focus:outline-none focus:border-amber-400"
                          />
                        </div>

                        {/* Remedy Telugu */}
                        <div>
                          <label className="block text-xs font-semibold text-amber-300 mb-1">
                            {lang === 'te' ? 'ప్రత్యేక పరిహారం / పరిష్కారం *' : 'Remedy in Telugu *'}
                          </label>
                          <input
                            type="text"
                            placeholder="ఉదా: ప్రత్యంగిరా దేవి హోమం, సిద్ధ రక్షా సూత్రం, మూలికా రక్ష."
                            value={svcRemedyTe}
                            onChange={(e) => setSvcRemedyTe(e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-[#0d0704] border border-amber-900/60 rounded-xl text-xs text-amber-100 focus:outline-none focus:border-amber-400"
                            required
                          />
                        </div>

                        {/* Remedy English */}
                        <div>
                          <label className="block text-xs font-semibold text-amber-300 mb-1">
                            {lang === 'te' ? 'Remedy in English' : 'Remedy in English'}
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Pratyangira Homa, energized sacred thread."
                            value={svcRemedyEn}
                            onChange={(e) => setSvcRemedyEn(e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-[#0d0704] border border-amber-900/60 rounded-xl text-xs text-amber-100 focus:outline-none focus:border-amber-400"
                          />
                        </div>
                      </div>

                      {/* Full Details & Badge Tag */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-semibold text-amber-300 mb-1">
                            {lang === 'te' ? 'పూర్తి వివరాలు (పాపప్ లో చూసేందుకు)' : 'Detailed Description (Popup)'}
                          </label>
                          <textarea
                            rows={2}
                            placeholder="సమస్య యొక్క మూల కారణాలు, పూజా విధానం, ఫలితం ఎలా కలుగుతుందో వివరంగా..."
                            value={svcFullDescTe}
                            onChange={(e) => setSvcFullDescTe(e.target.value)}
                            className="w-full px-3.5 py-2 bg-[#0d0704] border border-amber-900/60 rounded-xl text-xs text-amber-100 focus:outline-none focus:border-amber-400"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-amber-300 mb-1">
                            {lang === 'te' ? 'బ్యాడ్జ్ ట్యాగ్ (Badge)' : 'Badge Label'}
                          </label>
                          <input
                            type="text"
                            placeholder="ఉదా: శీఘ్ర ఫలితం / 100% శాశ్వతం"
                            value={svcBadgeTe}
                            onChange={(e) => setSvcBadgeTe(e.target.value)}
                            className="w-full px-3.5 py-2 bg-[#0d0704] border border-amber-900/60 rounded-xl text-xs text-amber-100 focus:outline-none focus:border-amber-400 mb-3"
                          />
                          <button
                            type="submit"
                            className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Plus className="w-4 h-4" />
                            <span>{lang === 'te' ? '+ సేవను జోడించండి' : '+ Add Service'}</span>
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>

                  {/* Existing Services Catalog Section */}
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h4 className="text-sm font-bold font-serif text-amber-200">
                          {lang === 'te' ? 'ప్రస్తుత సేవలు' : 'Current Services Catalog'} ({services.length})
                        </h4>
                        <p className="text-[11px] text-amber-400/70">
                          {lang === 'te'
                            ? 'అనవసరమైన సేవలను ఇక్కడ సులభంగా తొలగించవచ్చు.'
                            : 'Delete unneeded services or review active listings.'}
                        </p>
                      </div>

                      {/* Search & Filter */}
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <Search className="w-3.5 h-3.5 text-amber-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            placeholder={lang === 'te' ? 'సేవను వెతకండి...' : 'Search services...'}
                            value={svcSearch}
                            onChange={(e) => setSvcSearch(e.target.value)}
                            className="pl-8 pr-3 py-1 bg-[#0d0704] border border-amber-900/60 rounded-lg text-xs text-amber-100 placeholder-amber-500/50 focus:outline-none focus:border-amber-400 w-40 sm:w-52"
                          />
                        </div>
                        <select
                          value={svcFilterCat}
                          onChange={(e) => setSvcFilterCat(e.target.value as any)}
                          className="px-2.5 py-1 bg-[#0d0704] border border-amber-900/60 rounded-lg text-xs text-amber-300 focus:outline-none focus:border-amber-400"
                        >
                          <option value="all">{lang === 'te' ? 'అన్నీ' : 'All'}</option>
                          <option value="tantra">తంత్ర</option>
                          <option value="herbal">నాటు వైద్యం</option>
                          <option value="relationship">కుటుంబం</option>
                          <option value="astrology">జ్యోతిష్యం</option>
                        </select>
                      </div>
                    </div>

                    {/* Services Cards List */}
                    <div className="grid grid-cols-1 gap-2.5 max-h-96 overflow-y-auto pr-1">
                      {services
                        .filter((s) => {
                          const matchCat = svcFilterCat === 'all' || s.category === svcFilterCat;
                          const matchSearch =
                            svcSearch.trim() === '' ||
                            s.titleTe.toLowerCase().includes(svcSearch.toLowerCase()) ||
                            s.titleEn.toLowerCase().includes(svcSearch.toLowerCase()) ||
                            s.shortDescTe.toLowerCase().includes(svcSearch.toLowerCase());
                          return matchCat && matchSearch;
                        })
                        .map((svc) => (
                          <div
                            key={svc.id}
                            className="p-3 rounded-xl bg-[#140b07] border border-amber-900/40 hover:border-amber-700/60 transition-colors flex items-center justify-between gap-3"
                          >
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800/50">
                                  {svc.category}
                                </span>
                                {svc.badgeTe && (
                                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                                    {lang === 'te' ? svc.badgeTe : svc.badgeEn || svc.badgeTe}
                                  </span>
                                )}
                                <span className="text-xs font-bold text-amber-100 truncate">
                                  {lang === 'te' ? svc.titleTe : svc.titleEn || svc.titleTe}
                                </span>
                              </div>
                              <p className="text-[11px] text-amber-200/70 truncate">
                                {lang === 'te' ? svc.shortDescTe : svc.shortDescEn || svc.shortDescTe}
                              </p>
                              <div className="text-[10px] text-amber-400/80 mt-0.5 truncate">
                                <span className="font-semibold text-amber-300">పరిహారం:</span>{' '}
                                {lang === 'te' ? svc.remedyTe : svc.remedyEn || svc.remedyTe}
                              </div>
                            </div>

                            {/* Delete Action with Safe Confirmation */}
                            <div className="shrink-0 flex items-center">
                              {deleteConfirmId === svc.id ? (
                                <div className="flex items-center gap-1.5 p-1 bg-red-950/90 border border-red-700/80 rounded-lg">
                                  <span className="text-[11px] font-semibold text-red-200 px-1">
                                    {lang === 'te' ? 'తొలగించాలా?' : 'Delete?'}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteServiceConfirmed(svc.id)}
                                    className="px-2 py-1 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded transition-colors"
                                  >
                                    {lang === 'te' ? 'అవును' : 'Yes'}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setDeleteConfirmId(null)}
                                    className="px-2 py-1 bg-stone-800 hover:bg-stone-700 text-amber-200 text-xs rounded transition-colors"
                                  >
                                    {lang === 'te' ? 'వద్దు' : 'No'}
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => setDeleteConfirmId(svc.id)}
                                  className="p-1.5 text-red-400 hover:text-red-200 rounded-lg hover:bg-red-950/60 transition-colors cursor-pointer"
                                  title={lang === 'te' ? 'ఈ సేవను తొలగించండి' : 'Remove this service'}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: PRIVATE ADS */}
              {activeTab === 'ads' && (
                <div className="flex flex-col gap-6">
                  <div className="text-xs text-amber-300/80 bg-[#180e08] p-3 rounded-lg border border-amber-900/40">
                    {lang === 'te'
                      ? 'ప్రజలు వెబ్సైట్లో సమర్పించిన ప్రైవేట్ ప్రకటనలను ఇక్కడ ఆమోదించవచ్చు (Approve) లేదా తిరస్కరించవచ్చు (Reject).'
                      : 'Moderate user-submitted private ads. Approved ads show immediately on the public website.'}
                  </div>

                  <div className="flex flex-col gap-3">
                    {ads.length === 0 ? (
                      <p className="text-xs text-amber-400/60">No private ads available.</p>
                    ) : (
                      ads.map((ad) => (
                        <div
                          key={ad.id}
                          className={`p-4 rounded-xl border ${
                            ad.status === 'pending'
                              ? 'bg-[#1e1008] border-amber-600/60'
                              : ad.status === 'approved'
                              ? 'bg-[#11160e] border-emerald-800/60'
                              : 'bg-[#180c0c] border-red-900/40 opacity-70'
                          } flex flex-col sm:flex-row sm:items-center justify-between gap-4`}
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span
                                className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                                  ad.status === 'pending'
                                    ? 'bg-amber-500 text-stone-950'
                                    : ad.status === 'approved'
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-red-800 text-white'
                                }`}
                              >
                                {ad.status}
                              </span>
                              <span className="text-xs text-amber-400">{ad.category}</span>
                              {ad.city && <span className="text-xs text-amber-500/70">· {ad.city}</span>}
                            </div>
                            <h5 className="text-sm font-bold text-amber-100">{ad.title}</h5>
                            <p className="text-xs text-amber-200/80 mt-1 line-clamp-2">{ad.description}</p>
                            <div className="text-xs text-amber-300 font-mono mt-2">
                              Phone: <strong className="text-amber-100">{ad.contactNumber}</strong>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {ad.status !== 'approved' && (
                              <button
                                onClick={() => handleApproveAd(ad.id)}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg flex items-center gap-1 shadow-sm"
                              >
                                <CheckCircle className="w-3.5 h-3.5" />
                                <span>{lang === 'te' ? 'ఆమోదించు' : 'Approve'}</span>
                              </button>
                            )}

                            {ad.status !== 'rejected' && (
                              <button
                                onClick={() => handleRejectAd(ad.id)}
                                className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-amber-200 font-semibold text-xs rounded-lg flex items-center gap-1"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                <span>{lang === 'te' ? 'తిరస్కరించు' : 'Reject'}</span>
                              </button>
                            )}

                            <button
                              onClick={() => handleDeleteAd(ad.id)}
                              className="p-1.5 text-red-400 hover:text-red-200 rounded hover:bg-red-950/60"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: GOOGLE ADS */}
              {activeTab === 'googleAds' && (
                <form onSubmit={handleSaveGoogleAds} className="flex flex-col gap-4 max-w-xl">
                  <div className="flex items-center justify-between p-3 bg-[#180e08] rounded-xl border border-amber-900/50">
                    <div>
                      <div className="text-xs font-bold text-amber-100">
                        {lang === 'te' ? 'గూగుల్ యాడ్స్ యాక్టివేట్ చేయండి' : 'Enable Google Ads'}
                      </div>
                      <div className="text-[11px] text-amber-300/70">
                        {lang === 'te' ? 'వెబ్సైట్లో యాడ్స్ బ్యానర్లు కనిపిస్తాయి' : 'Render AdSense banners on pages'}
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={gAdsEnabled}
                      onChange={(e) => setGAdsEnabled(e.target.checked)}
                      className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-amber-300 mb-1">
                      Google AdSense Client ID (e.g. ca-pub-1234567890123456)
                    </label>
                    <input
                      type="text"
                      placeholder="ca-pub-..."
                      value={gAdsClient}
                      onChange={(e) => setGAdsClient(e.target.value)}
                      className="w-full px-3 py-2 bg-[#0e0704] border border-amber-800/60 rounded-lg text-xs text-amber-100 font-mono focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-amber-300 mb-1">
                      Google Ads Slot ID (e.g. 9876543210)
                    </label>
                    <input
                      type="text"
                      placeholder="Slot ID"
                      value={gAdsSlot}
                      onChange={(e) => setGAdsSlot(e.target.value)}
                      className="w-full px-3 py-2 bg-[#0e0704] border border-amber-800/60 rounded-lg text-xs text-amber-100 font-mono focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-amber-300 mb-1">
                      {lang === 'te' ? 'లేదా పూర్తి Google Ads Script Snippet ఇక్కడ పేస్ట్ చేయండి' : 'Or Paste Raw AdSense HTML/Script Snippet'}
                    </label>
                    <textarea
                      rows={4}
                      placeholder='<script async src="https://pagead2.googlesyndication.com/..."></script>'
                      value={gAdsSnippet}
                      onChange={(e) => setGAdsSnippet(e.target.value)}
                      className="w-full px-3 py-2 bg-[#0e0704] border border-amber-800/60 rounded-lg text-xs text-amber-100 font-mono focus:outline-none focus:border-amber-400 resize-none"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    {gAdsSaved ? (
                      <span className="text-xs text-emerald-400 font-semibold">
                        {lang === 'te' ? 'సెట్టింగ్స్ భద్రపరచబడ్డాయి!' : 'Saved successfully!'}
                      </span>
                    ) : (
                      <span />
                    )}

                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl shadow-md transition-colors"
                    >
                      {lang === 'te' ? 'సేవ్ చేయండి' : 'Save Google Ads Config'}
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 4: LEADS / INQUIRIES */}
              {activeTab === 'leads' && (
                <div className="flex flex-col gap-3">
                  <div className="text-xs text-amber-300/80 bg-[#180e08] p-3 rounded-lg border border-amber-900/40">
                    {lang === 'te'
                      ? 'భక్తులు, ప్రజలు పంపిన సంప్రదింపు అభ్యర్థనలు (Consultation Inquiries)'
                      : 'Incoming consultation leads submitted through the appointment form.'}
                  </div>

                  {leads.length === 0 ? (
                    <p className="text-xs text-amber-400/60">No consultation requests yet.</p>
                  ) : (
                    leads.map((lead) => (
                      <div
                        key={lead.id}
                        className="p-4 rounded-xl bg-[#120a06] border border-amber-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div>
                          <div className="text-xs text-amber-400 font-semibold mb-0.5">
                            {lead.problemType}
                          </div>
                          <h5 className="text-sm font-bold text-amber-100">{lead.name}</h5>
                          {lead.details && (
                            <p className="text-xs text-amber-200/80 mt-1">{lead.details}</p>
                          )}
                          <div className="text-[11px] text-amber-400/70 font-mono mt-1">
                            {new Date(lead.createdAt).toLocaleString()}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <a
                            href={`https://wa.me/91${lead.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                              `నమస్కారం ${lead.name} గారు, శ్రీనివాస్ మహారాజ్ గారి సద్గురు నాటు వైద్యం సెంటర్ నుండి మాట్లాడుతున్నాము.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs rounded-lg"
                          >
                            WhatsApp
                          </a>
                          <a
                            href={`tel:${lead.phone}`}
                            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-lg"
                          >
                            Call {lead.phone}
                          </a>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* TAB 5: HOSTINGER & CPANEL DEPLOYMENT CENTER */}
              {activeTab === 'bigrock' && (
                <div className="flex flex-col gap-5 max-w-3xl text-xs sm:text-sm text-amber-200/90 leading-relaxed">
                  {/* Hero Banner */}
                  <div className="p-5 bg-gradient-to-r from-[#1f1109] via-[#2a170c] to-[#1a0e08] border border-amber-600/60 rounded-2xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-[10px] tracking-wider uppercase border border-amber-500/40">
                          Hostinger Verified
                        </span>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px] tracking-wider uppercase border border-emerald-500/40">
                          LiteSpeed Ready
                        </span>
                      </div>
                      <h4 className="text-base sm:text-lg font-bold font-serif text-amber-100 flex items-center gap-2">
                        <Server className="w-5 h-5 text-amber-400" />
                        <span>
                          {lang === 'te'
                            ? 'Hostinger వెబ్‌సైట్ అప్‌లోడ్ & సపోర్టింగ్ ఫైల్స్'
                            : 'Hostinger Website Upload & Supporting Files'}
                        </span>
                      </h4>
                      <p className="text-xs text-amber-300/80 mt-1 max-w-xl">
                        {lang === 'te'
                          ? 'ఈ వెబ్‌సైట్‌ను Hostinger hPanel (public_html) లేదా cPanel లో నేరుగా అప్‌లోడ్ చేయడానికి అవసరమైన అన్ని ఫైల్స్ ఇక్కడ సిద్ధంగా ఉన్నాయి.'
                          : 'Everything you need to deploy this high-performance website directly to Hostinger hPanel (public_html) or cPanel without server build steps.'}
                      </p>
                    </div>

                    <a
                      href="/hostinger-deploy.zip"
                      download="hostinger-deploy.zip"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-95 transition-all shrink-0"
                    >
                      <Download className="w-4 h-4" />
                      <span>{lang === 'te' ? 'Hostinger Zip డౌన్‌లోడ్ (1-Click)' : 'Download Hostinger Package (.zip)'}</span>
                    </a>
                  </div>

                  {/* 1-Click Download & Export Action Cards */}
                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-wider text-amber-400/90 mb-2.5">
                      {lang === 'te' ? 'సపోర్టింగ్ ఫైల్స్ డౌన్‌లోడ్ & కాపీ:' : 'Supporting Files Direct Download & Copy:'}
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                      {/* .htaccess */}
                      <div className="p-3 bg-[#110905] rounded-xl border border-amber-900/60 flex flex-col justify-between gap-2.5">
                        <div className="flex items-start justify-between gap-1">
                          <div>
                            <div className="font-mono text-xs font-bold text-amber-100 flex items-center gap-1.5">
                              <FileText className="w-3.5 h-3.5 text-amber-400" />
                              <span>.htaccess</span>
                            </div>
                            <p className="text-[10px] text-amber-300/70 mt-0.5">
                              {lang === 'te' ? 'LiteSpeed రీడైరెక్ట్ & క్యాషింగ్' : 'LiteSpeed Rewrite & Cache'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 pt-1 border-t border-amber-900/40">
                          <button
                            type="button"
                            onClick={() => downloadTextFile('.htaccess', htaccessCode)}
                            className="flex-1 py-1 px-2 bg-amber-950/80 hover:bg-amber-900 text-amber-200 text-[11px] font-semibold rounded border border-amber-800/60 flex items-center justify-center gap-1"
                          >
                            <Download className="w-3 h-3" />
                            <span>Download</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(htaccessCode);
                              setCopiedHtaccess(true);
                              setTimeout(() => setCopiedHtaccess(false), 2000);
                            }}
                            className="py-1 px-2 bg-[#1b100a] hover:bg-amber-900/60 text-amber-300 text-[11px] rounded border border-amber-900/60 flex items-center gap-1"
                            title="Copy .htaccess code"
                          >
                            {copiedHtaccess ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                      </div>

                      {/* robots.txt */}
                      <div className="p-3 bg-[#110905] rounded-xl border border-amber-900/60 flex flex-col justify-between gap-2.5">
                        <div className="flex items-start justify-between gap-1">
                          <div>
                            <div className="font-mono text-xs font-bold text-amber-100 flex items-center gap-1.5">
                              <FileText className="w-3.5 h-3.5 text-amber-400" />
                              <span>robots.txt</span>
                            </div>
                            <p className="text-[10px] text-amber-300/70 mt-0.5">
                              {lang === 'te' ? 'గూగుల్ & బింగ్ సెర్చ్ ర్యాంకింగ్' : 'Google & Bing Crawlers'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 pt-1 border-t border-amber-900/40">
                          <button
                            type="button"
                            onClick={() => downloadTextFile('robots.txt', robotsCode)}
                            className="flex-1 py-1 px-2 bg-amber-950/80 hover:bg-amber-900 text-amber-200 text-[11px] font-semibold rounded border border-amber-800/60 flex items-center justify-center gap-1"
                          >
                            <Download className="w-3 h-3" />
                            <span>Download</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(robotsCode);
                              setCopiedRobots(true);
                              setTimeout(() => setCopiedRobots(false), 2000);
                            }}
                            className="py-1 px-2 bg-[#1b100a] hover:bg-amber-900/60 text-amber-300 text-[11px] rounded border border-amber-900/60 flex items-center gap-1"
                            title="Copy robots.txt code"
                          >
                            {copiedRobots ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                      </div>

                      {/* sitemap.xml */}
                      <div className="p-3 bg-[#110905] rounded-xl border border-amber-900/60 flex flex-col justify-between gap-2.5">
                        <div className="flex items-start justify-between gap-1">
                          <div>
                            <div className="font-mono text-xs font-bold text-amber-100 flex items-center gap-1.5">
                              <FileText className="w-3.5 h-3.5 text-amber-400" />
                              <span>sitemap.xml</span>
                            </div>
                            <p className="text-[10px] text-amber-300/70 mt-0.5">
                              {lang === 'te' ? 'వెబ్‌సైట్ పేజీలు & సైట్‌మ్యాప్' : 'XML SEO Sitemap'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 pt-1 border-t border-amber-900/40">
                          <button
                            type="button"
                            onClick={() => downloadTextFile('sitemap.xml', sitemapCode, 'application/xml')}
                            className="flex-1 py-1 px-2 bg-amber-950/80 hover:bg-amber-900 text-amber-200 text-[11px] font-semibold rounded border border-amber-800/60 flex items-center justify-center gap-1"
                          >
                            <Download className="w-3 h-3" />
                            <span>Download</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(sitemapCode);
                              setCopiedSitemap(true);
                              setTimeout(() => setCopiedSitemap(false), 2000);
                            }}
                            className="py-1 px-2 bg-[#1b100a] hover:bg-amber-900/60 text-amber-300 text-[11px] rounded border border-amber-900/60 flex items-center gap-1"
                            title="Copy sitemap.xml code"
                          >
                            {copiedSitemap ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                      </div>

                      {/* Guide Text */}
                      <div className="p-3 bg-[#110905] rounded-xl border border-amber-900/60 flex flex-col justify-between gap-2.5">
                        <div className="flex items-start justify-between gap-1">
                          <div>
                            <div className="font-mono text-xs font-bold text-amber-100 flex items-center gap-1.5">
                              <FileText className="w-3.5 h-3.5 text-amber-400" />
                              <span>GUIDE.txt</span>
                            </div>
                            <p className="text-[10px] text-amber-300/70 mt-0.5">
                              {lang === 'te' ? '5 స్టెప్స్ సూచనల పత్రం' : '5-Step Hostinger Manual'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 pt-1 border-t border-amber-900/40">
                          <button
                            type="button"
                            onClick={() => downloadTextFile('HOSTINGER_UPLOAD_GUIDE.txt', hostingerGuideText)}
                            className="flex-1 py-1 px-2 bg-amber-950/80 hover:bg-amber-900 text-amber-200 text-[11px] font-semibold rounded border border-amber-800/60 flex items-center justify-center gap-1"
                          >
                            <Download className="w-3 h-3" />
                            <span>Download</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(hostingerGuideText);
                              setCopiedGuide(true);
                              setTimeout(() => setCopiedGuide(false), 2000);
                            }}
                            className="py-1 px-2 bg-[#1b100a] hover:bg-amber-900/60 text-amber-300 text-[11px] rounded border border-amber-900/60 flex items-center gap-1"
                            title="Copy Guide text"
                          >
                            {copiedGuide ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 5-Step Hostinger Upload Walkthrough */}
                  <div className="space-y-3">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-amber-400/90">
                      {lang === 'te' ? 'Hostinger లో అప్‌లోడ్ చేసే 5 సులభమైన స్టెప్స్:' : '5 Easy Steps to Deploy to Hostinger:'}
                    </h5>

                    <div className="p-3 bg-[#110905] rounded-xl border border-amber-900/40 flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-amber-900/80 text-amber-200 font-bold text-xs flex items-center justify-center shrink-0 border border-amber-700/60">
                        1
                      </span>
                      <div>
                        <strong className="text-amber-100 block mb-0.5">
                          {lang === 'te' ? 'హోస్టింగర్ ప్యాకేజీని డౌన్‌లోడ్ చేసుకోండి' : 'Download the Hostinger Package'}
                        </strong>
                        <p className="text-xs text-amber-300/70">
                          {lang === 'te'
                            ? 'పైనున్న "Hostinger Zip డౌన్‌లోడ్" బటన్‌పై క్లిక్ చేసి hostinger-deploy.zip ఫైల్‌ను మీ కంప్యూటర్‌లోకి డౌన్‌లోడ్ చేసుకోండి.'
                            : 'Click "Download Hostinger Package (.zip)" above to save hostinger-deploy.zip directly to your computer.'}
                        </p>
                      </div>
                    </div>

                    <div className="p-3 bg-[#110905] rounded-xl border border-amber-900/40 flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-amber-900/80 text-amber-200 font-bold text-xs flex items-center justify-center shrink-0 border border-amber-700/60">
                        2
                      </span>
                      <div>
                        <strong className="text-amber-100 block mb-0.5">
                          {lang === 'te' ? 'Hostinger hPanel లోకి లాగిన్ అవ్వండి' : 'Log into Hostinger hPanel'}
                        </strong>
                        <p className="text-xs text-amber-300/70">
                          {lang === 'te'
                            ? 'హోస్టింగర్ ఖాతా (hpanel.hostinger.com) ఓపెన్ చేసి, "Websites" లోకి వెళ్లి మీ డొమైన్ పక్కనున్న "Manage" బటన్ నొక్కండి.'
                            : 'Open hpanel.hostinger.com, navigate to "Websites" and click the "Manage" button next to your active domain.'}
                        </p>
                      </div>
                    </div>

                    <div className="p-3 bg-[#110905] rounded-xl border border-amber-900/40 flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-amber-900/80 text-amber-200 font-bold text-xs flex items-center justify-center shrink-0 border border-amber-700/60">
                        3
                      </span>
                      <div>
                        <strong className="text-amber-100 block mb-0.5">
                          {lang === 'te' ? 'File Manager -> public_html తెరవండి' : 'Open File Manager -> public_html'}
                        </strong>
                        <p className="text-xs text-amber-300/70">
                          {lang === 'te'
                            ? '"Files" సెక్షన్‌లో "File Manager" పై క్లిక్ చేయండి. ఆ తర్వాత "public_html" ఫోల్డర్‌పై డబుల్ క్లిక్ చేసి తెరవండి.'
                            : 'Under Files, click "File Manager". Then double-click into the "public_html" directory.'}
                        </p>
                      </div>
                    </div>

                    <div className="p-3 bg-[#110905] rounded-xl border border-amber-900/40 flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-amber-900/80 text-amber-200 font-bold text-xs flex items-center justify-center shrink-0 border border-amber-700/60">
                        4
                      </span>
                      <div>
                        <strong className="text-amber-100 block mb-0.5">
                          {lang === 'te' ? 'అప్‌లోడ్ చేసి Extract చేయండి' : 'Upload and Extract'}
                        </strong>
                        <p className="text-xs text-amber-300/70">
                          {lang === 'te'
                            ? 'పైన ఉన్న Upload ఐకాన్ క్లిక్ చేసి hostinger-deploy.zip ను public_html లోకి అప్‌లోడ్ చేయండి. అనంతరం దానిపై రైట్ క్లిక్ చేసి "Extract" నొక్కండి. (లేదా dist ఫోల్డర్‌లోని ఫైల్స్‌ను డ్రాగ్ అండ్ డ్రాప్ చేయండి).'
                            : 'Upload hostinger-deploy.zip into public_html and right-click -> Extract. (Or upload index.html, assets, .htaccess, robots.txt, sitemap.xml directly).'}
                        </p>
                      </div>
                    </div>

                    <div className="p-3 bg-[#110905] rounded-xl border border-amber-900/40 flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-emerald-900/80 text-emerald-200 font-bold text-xs flex items-center justify-center shrink-0 border border-emerald-700/60">
                        5
                      </span>
                      <div>
                        <strong className="text-amber-100 block mb-0.5">
                          {lang === 'te' ? 'వెబ్‌సైట్ లైవ్ తనిఖీ చేయండి' : 'Check Your Live Website'}
                        </strong>
                        <p className="text-xs text-amber-300/70">
                          {lang === 'te'
                            ? 'బ్రౌజర్‌లో మీ డొమైన్ (ఉదా: https://sadgurunatuvaidyam.com) ఓపెన్ చేయండి. LiteSpeed క్యాషింగ్ మరియు SSL రక్షణతో వెబ్‌సైట్ సూపర్ ఫాస్ట్‌గా పనిచేస్తుంది!'
                            : 'Visit your domain in the browser. The website will load instantly with HTTPS, full SEO sitemap, and LiteSpeed performance optimizations.'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* .htaccess Code Preview Box */}
                  <div className="p-3 bg-[#110905] rounded-xl border border-amber-900/40">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-amber-400" />
                        <strong className="text-amber-100 text-xs">
                          {lang === 'te' ? 'Hostinger .htaccess కాన్ఫిగరేషన్ ప్రివ్యూ' : 'Hostinger .htaccess Configuration Preview'}
                        </strong>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(htaccessCode);
                          setCopiedHtaccess(true);
                          setTimeout(() => setCopiedHtaccess(false), 2000);
                        }}
                        className="flex items-center gap-1 text-[11px] px-2.5 py-1 bg-amber-950 hover:bg-amber-900 text-amber-200 rounded border border-amber-700/60 transition-colors"
                      >
                        {copiedHtaccess ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedHtaccess ? 'Copied!' : 'Copy Code'}</span>
                      </button>
                    </div>
                    <pre className="p-2.5 bg-black/70 rounded-lg text-[10px] font-mono text-amber-300/90 overflow-x-auto max-h-40 border border-amber-950">
                      {htaccessCode}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

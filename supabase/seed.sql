-- ==========================================
-- CyberAkshak Seed Data
-- Database Initial Seed for Events & Categories
-- ==========================================

INSERT INTO public.events (
  id,
  title,
  description,
  starts_at,
  location,
  category,
  registration_url,
  status
)
VALUES
  (
    '11111111-1111-1111-1111-111111111111',
    'Deepfake voice scams & AI audio defense',
    'Learn how cybercriminals clone human voices using 3-second audio clips and discover practical verification techniques to protect family finances.',
    NOW() + INTERVAL '3 days',
    'Online (Zoom)',
    'Webinar',
    'https://cyberakshak.in/events/deepfake-webinar',
    'published'
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'Cyber safety & digital hygiene for students',
    'Hands-on session on identifying fake job recruitment, student loan app harassment, account safety, and safe social media privacy practices.',
    NOW() + INTERVAL '10 days',
    'Campus Auditorium & Live Stream',
    'Seminar',
    'https://cyberakshak.in/events/campus-hygiene',
    'published'
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    'Secure your UPI, Net Banking & Wallets',
    'Live walkthrough of setting transaction limits, avoiding malicious QR codes, reporting accidental transfers, and emergency chargebacks.',
    NOW() + INTERVAL '18 days',
    'Interactive Workshop',
    'Workshop',
    'https://cyberakshak.in/events/upi-security',
    'published'
  ),
  (
    '44444444-4444-4444-4444-444444444444',
    'Spotting Phishing, Smishing & Fake Courier Alerts',
    'Break down deceptive SMS text patterns, domain manipulation tricks, and malicious APK payloads in this beginner-friendly security masterclass.',
    NOW() + INTERVAL '25 days',
    'Online',
    'Webinar',
    'https://cyberakshak.in/events/phishing-masterclass',
    'published'
  )
ON CONFLICT (id) DO NOTHING;

export class SocialShare {
 static async generateShareImage(profile: any): Promise<string> {
  if (typeof window === 'undefined') return '';

  return new Promise((resolve) => {
   // Create an SVG element that matches your component exactly
   const svg = `
        <svg width="1200" height="800" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#ef4444"/>
              <stop offset="50%" stop-color="#3b82f6"/>
              <stop offset="100%" stop-color="#10b981"/>
            </linearGradient>
            <style>
              .text { font-family: Arial, sans-serif; }
              .title { font-size: 64px; font-weight: bold; fill: #1f2937; }
              .subtitle { font-size: 32px; fill: #ffffff; }
              .label { font-size: 28px; font-weight: 500; fill: #374151; }
              .complexity { font-size: 36px; font-weight: bold; fill: #1f2937; }
              .url { font-size: 24px; fill: #6b7280; }
            </style>
          </defs>
          
          <!-- Background -->
          <rect width="100%" height="100%" fill="white"/>
          
          <!-- Header -->
          <rect width="100%" height="150" fill="#615FFF"/>
          <text x="600" y="80" text-anchor="middle" class="text title" fill="white">MosaicMind</text>
          <text x="600" y="130" text-anchor="middle" class="text subtitle" fill="white">Personality Assessment Results</text>
          
          <!-- Radial Chart -->
          <g transform="translate(600, 450)">
            ${this.generateRadialChartSVG(profile.scores, 300)}
          </g>
          
          <!-- Footer -->
          <text x="600" y="720" text-anchor="middle" class="text complexity">
            Pattern Complexity: ${profile.visualization.complexity}/100
          </text>
          <text x="600" y="770" text-anchor="middle" class="text url">
            mosaicmind.vercel.app
          </text>
        </svg>
      `;

   // Convert SVG to data URL
   const svgBlob = new Blob([svg], {type: 'image/svg+xml;charset=utf-8'});
   const url = URL.createObjectURL(svgBlob);

   const img = new Image();
   img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 800;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);

    URL.revokeObjectURL(url);
    resolve(canvas.toDataURL('image/png'));
   };

   img.src = url;
  });
 }

 private static generateRadialChartSVG(scores: any[], size: number): string {
  const scale = size / 60; // Scale factor

  return `
      <!-- Grid circles -->
      <circle cx="0" cy="0" r="${
       40 * scale
      }" fill="none" stroke="#e5e7eb" stroke-width="1"/>
      <circle cx="0" cy="0" r="${
       30 * scale
      }" fill="none" stroke="#e5e7eb" stroke-width="1"/>
      <circle cx="0" cy="0" r="${
       20 * scale
      }" fill="none" stroke="#e5e7eb" stroke-width="1"/>
      <circle cx="0" cy="0" r="${
       10 * scale
      }" fill="none" stroke="#e5e7eb" stroke-width="1"/>

      <!-- Connecting polygon -->
      <polygon
        points="${scores
         .map((score, index) => {
          const angle = (index * 2 * Math.PI) / scores.length;
          const radius = (10 + (score.score / 100) * 30) * scale;
          const x = radius * Math.cos(angle);
          const y = radius * Math.sin(angle);
          return `${x},${y}`;
         })
         .join(' ')}"
        fill="rgba(59, 130, 246, 0.1)"
        stroke="url(#gradient)"
        stroke-width="${2 * scale}"
      />

      <!-- Data points -->
      ${scores
       .map((score, index) => {
        const angle = (index * 2 * Math.PI) / scores.length;
        const radius = (10 + (score.score / 100) * 30) * scale;
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);
        const color =
         score.score >= 70
          ? '#10b981'
          : score.score >= 30
          ? '#3b82f6'
          : '#ef4444';

        return `
          <circle cx="${x}" cy="${y}" r="${
         4 * scale
        }" fill="${color}" stroke="white" stroke-width="${1.5 * scale}"/>
        `;
       })
       .join('')}

      <!-- Category labels -->
      ${scores
       .map((score, index) => {
        const angle = (index * 2 * Math.PI) / scores.length;
        const labelRadius = 46 * scale;
        const x = labelRadius * Math.cos(angle);
        const y = labelRadius * Math.sin(angle);

        let textAnchor = 'middle';
        if (
         Math.abs(angle) < Math.PI / 6 ||
         Math.abs(angle) > (5 * Math.PI) / 6
        ) {
         textAnchor = 'middle';
        } else if (angle > 0 && angle < Math.PI) {
         textAnchor = 'start';
        } else {
         textAnchor = 'end';
        }

        return `
          <text 
            x="${x}" 
            y="${y}" 
            text-anchor="${textAnchor}" 
            dominant-baseline="middle" 
            class="text label"
            style="text-shadow: 0 0 3px white, 0 0 3px white, 0 0 3px white;"
          >
            ${score.category.toUpperCase()}
          </text>
        `;
       })
       .join('')}

      <!-- Center point -->
      <circle cx="0" cy="0" r="${2 * scale}" fill="#6b7280" opacity="0.5"/>
    `;
 }

 static async shareToTwitter(profile: any) {
  const text = `Just discovered my unique personality mosaic with MosaicMind! 🧩\n\nPattern Complexity: ${profile.visualization.complexity}/100\n\nCheck out your personality pattern:`;
  const url = window.location.href;
  const hashtags = 'MosaicMind,Personality,Psychology,SelfDiscovery';

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
   text
  )}&url=${encodeURIComponent(url)}&hashtags=${encodeURIComponent(hashtags)}`;

  window.open(twitterUrl, '_blank', 'width=600,height=400');
 }

 static async shareToInstagram(profile: any) {
  // Instagram doesn't support direct sharing from web, so we provide download
  const imageUrl = await this.generateShareImage(profile);

  // Create download link for the image
  const link = document.createElement('a');
  link.download = `mosaicmind-profile-${Date.now()}.png`;
  link.href = imageUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Show instructions for Instagram
  alert(
   'Your MosaicMind image has been downloaded! You can now share it on Instagram:\n\n1. Open Instagram\n2. Create a new post\n3. Upload the downloaded image\n4. Add your results and tag #MosaicMind'
  );
 }

 static async shareToLinkedIn(profile: any) {
  const title = 'My MosaicMind Personality Assessment';
  const summary = `I just completed the MosaicMind personality assessment and discovered my unique personality pattern with ${profile.visualization.complexity}/100 complexity.`;
  const url = window.location.href;
  const source = 'MosaicMind';

  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
   url
  )}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(
   summary
  )}&source=${encodeURIComponent(source)}`;

  window.open(linkedInUrl, '_blank', 'width=600,height=600');
 }

 static async copyShareableLink() {
  const url = window.location.href;
  try {
   await navigator.clipboard.writeText(url);
   return true;
  } catch (err) {
   // Fallback for older browsers
   const textArea = document.createElement('textarea');
   textArea.value = url;
   document.body.appendChild(textArea);
   textArea.select();
   document.execCommand('copy');
   document.body.removeChild(textArea);
   return true;
  }
 }
}

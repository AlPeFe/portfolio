/* ============================================
   REPO GRAPH — D3.js Interactive Visualization
   ============================================ */

(function () {
  'use strict';

  // ── Color palette by language ──────────────────────────
  const LANG_COLORS = {
    'C#':          '#9b7fdf',
    'C':           '#555555',
    'TypeScript':  '#3178C6',
    'JavaScript':  '#f0db4f',
    'Python':      '#3572A9',
    'HTML':        '#e34c26',
    'CSS':         '#563d7c',
    'SCSS':        '#c6538c',
    'PowerShell':  '#012456',
    'Java':        '#b07219',
    'Dockerfile':  '#2496ED',
    'TSQL':        '#e38c00',
    'PLSQL':       '#f80000',
    'Nix':         '#7e7eff',
    'Shell':       '#89e051',
    'Vue':         '#41b883',
    'Astro':       '#ff5a03',
    'MDX':         '#fcbf49',
    'Handlebars':  '#f87e09',
    'Batchfile':   '#c1d124',
    'ASP.NET':     '#68217a',
    'PostScript':  '#cbcb09',
    '?':           '#666688',
  };

  function getLangColor(lang) {
    return LANG_COLORS[lang] || '#666688';
  }

  // ── Node size by activity ────────────────────────────────
  function nodeRadius(updated) {
    const monthsAgo = (Date.now() - new Date(updated)) / (1000 * 60 * 60 * 24 * 30);
    return Math.max(5, Math.min(22, 16 - monthsAgo * 0.6 + Math.random() * 4));
  }

  // ── Node/link data ───────────────────────────────────────
  const nodes = [
    // AlPeFe public repos
    { id: 'opencode',              label: 'opencode',              lang: 'TypeScript', size: 14, updated: '2026-05-08', owner: 'personal', langs: ['TypeScript','Astro','MDX','CSS','JS','Shell'] },
    { id: 'PolaperTaskBoard',      label: 'PolaperTaskBoard',      lang: 'TypeScript', size: 10, updated: '2026-05-04', owner: 'personal', langs: ['TypeScript','Python','CSS','HTML'] },
    { id: 'tui-server-setup',      label: 'tui-server-setup',      lang: 'C#',         size: 8,  updated: '2026-04-28', owner: 'personal', langs: ['C#'] },
    { id: 'PolaperBotV2',          label: 'PolaperBotV2',          lang: 'C#',         size: 9,  updated: '2026-03-06', owner: 'personal', langs: ['C#'] },
    { id: 'PolaperMon',            label: 'PolaperMon',            lang: 'C#',         size: 7,  updated: '2026-02-23', owner: 'personal', langs: ['C#'] },
    { id: 'PolaperRientCLI',       label: 'PolaperRientCLI',       lang: 'C#',         size: 7,  updated: '2026-02-17', owner: 'personal', langs: ['C#'] },
    { id: 'SqlServerMcp',          label: 'SqlServerMcp',          lang: 'C#',         size: 8,  updated: '2026-01-16', owner: 'personal', langs: ['C#'] },
    { id: 'suwayomi-skill',        label: 'suwayomi-skill',        lang: '? ',         size: 6,  updated: '2026-04-23', owner: 'personal', langs: [] },
    { id: 'hermes-skills',         label: 'hermes-skills',         lang: '? ',         size: 7,  updated: '2026-03-23', owner: 'personal', langs: [] },
    { id: 'free-games-skill',      label: 'free-games-skill',      lang: '? ',         size: 5,  updated: '2026-04-11', owner: 'personal', langs: [] },
    { id: 'Mouse-Jiggler',         label: 'Mouse-Jiggler',         lang: 'Python',     size: 7,  updated: '2026-01-15', owner: 'personal', langs: ['Python'] },
    { id: 'Clean-Code-Template',    label: 'Clean-Code-Template',   lang: 'C#',         size: 6,  updated: '2025-09-25', owner: 'personal', langs: ['C#'] },
    { id: 'polaper.adapter',        label: 'polaper.adapter',        lang: 'C#',         size: 6,  updated: '2025-04-01', owner: 'personal', langs: ['C#'] },
    { id: 'P12AssertionToFile',    label: 'P12AssertionToFile',   lang: 'C#',         size: 5,  updated: '2026-04-08', owner: 'personal', langs: ['C#'] },
    { id: 'appsettings_replace_ps',label: 'appsettings_replace_ps',lang: 'PowerShell', size: 5,  updated: '2026-04-21', owner: 'personal', langs: ['PowerShell'] },
    { id: 'serilog-error-extractor',label: 'serilog-error-extractor',lang:'PowerShell', size: 5,  updated: '2026-04-20', owner: 'personal', langs: ['PowerShell'] },
    { id: 'dotnet-winget-install',  label: 'dotnet-winget-install',  lang: 'PowerShell', size: 5,  updated: '2026-03-24', owner: 'personal', langs: ['PowerShell'] },
    { id: 'hakuneko',              label: 'hakuneko',              lang: 'JavaScript', size: 8,  updated: '2026-03-25', owner: 'personal', langs: ['JavaScript'] },
    { id: 'me',                    label: 'me',                    lang: 'JavaScript', size: 6,  updated: '2026-02-15', owner: 'personal', langs: ['JavaScript'] },
    { id: 'PolaperLinku',          label: 'PolaperLinku',          lang: 'C#',         size: 6,  updated: '2026-02-09', owner: 'personal', langs: ['C#'] },
    { id: 'raco',                  label: 'raco',                  lang: '? ',         size: 5,  updated: '2026-01-16', owner: 'personal', langs: [] },
    { id: 'POLAPER.BOT',           label: 'POLAPER.BOT',           lang: '? ',         size: 6,  updated: '2026-02-14', owner: 'personal', langs: [] },
    { id: 'hanni-obsidian-workflow',label: 'hanni-obsidian-workflow',lang:'HTML',      size: 7,  updated: '2026-05-04', owner: 'personal', langs: ['HTML'] },
    { id: 'hanni-downloader',      label: 'hanni-downloader',      lang: 'HTML',       size: 6,  updated: '2026-03-23', owner: 'personal', langs: ['HTML'] },

    // OriginalSoft org repos (representative sample, most recent)
    { id: 'GamPandora.Integration', label: 'GamPandora.Integration', lang: 'C#', size: 16, updated: '2026-05-15', owner: 'org', langs: ['C#','HTML','CSS','TSQL'] },
    { id: 'GamNet',                label: 'GamNet',                lang: 'C#', size: 16, updated: '2026-05-15', owner: 'org', langs: ['C#','HTML','CSS','JS','Dockerfile'] },
    { id: 'Gam.SosNavarra',        label: 'Gam.SosNavarra',        lang: 'C#', size: 14, updated: '2026-05-14', owner: 'org', langs: ['C#'] },
    { id: 'GamIntraStandard',      label: 'GamIntraStandard',      lang: 'JavaScript', size: 12, updated: '2026-05-14', owner: 'org', langs: ['JavaScript','C#','HTML','CSS'] },
    { id: 'Menarini.Portal',       label: 'Menarini.Portal',       lang: 'JavaScript', size: 12, updated: '2026-05-13', owner: 'org', langs: ['JavaScript','HTML','PLSQL','C#'] },
    { id: 'GamPandora.Integracion.GAM', label: 'GamPandora.Integracion.GAM', lang: 'C#', size: 15, updated: '2026-05-12', owner: 'org', langs: ['C#','Dockerfile','TSQL'] },
    { id: 'GamSergas_ExcelControlCalidad', label: 'GamSergas_Excel...', lang: 'C#', size: 10, updated: '2026-05-07', owner: 'org', langs: ['C#'] },
    { id: 'GamDroidAPI',           label: 'GamDroidAPI',           lang: 'C#', size: 10, updated: '2026-05-07', owner: 'org', langs: ['C#'] },
    { id: 'GamCpr.Estandar',       label: 'GamCpr.Estandar',       lang: 'C#', size: 9,  updated: '2026-05-06', owner: 'org', langs: ['C#','HTML','JS','CSS'] },
    { id: 'Gam.TeladocHealth',     label: 'Gam.TeladocHealth',    lang: 'C#', size: 9,  updated: '2026-04-30', owner: 'org', langs: ['C#'] },
    { id: 'GamPandora.Portal',     label: 'GamPandora.Portal',    lang: 'C#', size: 9,  updated: '2026-04-29', owner: 'org', langs: ['C#','HTML','CSS','JS'] },
    { id: 'GamSumm2.0',            label: 'GamSumm2.0',            lang: 'C#', size: 8,  updated: '2026-04-21', owner: 'org', langs: ['C#'] },
    { id: 'GamCip.Core',           label: 'GamCip.Core',           lang: 'C#', size: 8,  updated: '2026-04-13', owner: 'org', langs: ['C#'] },
    { id: 'GamASISA',              label: 'GamASISA',              lang: 'C#', size: 8,  updated: '2026-03-09', owner: 'org', langs: ['C#'] },
    { id: 'GamNet-k6',             label: 'GamNet-k6',            lang: 'JavaScript', size: 7, updated: '2026-03-09', owner: 'org', langs: ['JavaScript','PowerShell'] },
    { id: 'GamDroid.AutomaticStatus', label: 'GamDroid.Auto...',  lang: 'C#', size: 7,  updated: '2025-12-01', owner: 'org', langs: ['C#'] },
    { id: 'Mdm.OriginalSoft',      label: 'Mdm.OriginalSoft',    lang: 'JavaScript', size: 9, updated: '2025-11-28', owner: 'org', langs: ['JavaScript','C#','HTML','CSS','SCSS','ASP.NET'] },
    { id: 'Gam-API',              label: 'Gam-API',               lang: 'C#', size: 10, updated: '2026-02-24', owner: 'org', langs: ['C#','HTML','CSS','JS','TSQL'] },
    { id: 'GamWhatsApp',          label: 'GamWhatsApp',          lang: 'C#', size: 7,  updated: '2026-02-24', owner: 'org', langs: ['C#'] },
    { id: 'GamDroidAdvancedCheckList', label: 'GamDroidAdv...',   lang: 'C#', size: 7,  updated: '2026-03-03', owner: 'org', langs: ['C#','HTML','JS','CSS'] },
  ];

  // ── Edges: shared technology connections ─────────────────
  // Nodes connect if they share a primary language OR share a secondary language
  const links = [];
  const langGroups = {};

  // Group nodes by primary language
  nodes.forEach(n => {
    if (!langGroups[n.lang]) langGroups[n.lang] = [];
    langGroups[n.lang].push(n.id);
  });

  // Within each group, connect the most recent nodes
  Object.entries(langGroups).forEach(([lang, ids]) => {
    if (ids.length < 2) return;
    // Connect all to the most recent (largest size)
    const sorted = [...ids].sort((a, b) => {
      const na = nodes.find(n => n.id === a);
      const nb = nodes.find(n => n.id === b);
      return (nb.size || 0) - (na.size || 0);
    });
    // Connect top nodes to each other
    for (let i = 0; i < Math.min(sorted.length, 8); i++) {
      for (let j = i + 1; j < Math.min(sorted.length, 8); j++) {
        if (Math.random() < 0.55) {
          links.push({ source: sorted[i], target: sorted[j], weight: 1 });
        }
      }
    }
  });

  // Cross-language edges: if nodes share secondary langs
  nodes.forEach(n => {
    if (!n.langs) return;
    n.langs.forEach(sl => {
      if (sl === n.lang || !langGroups[sl]) return;
      langGroups[sl].forEach(otherId => {
        if (otherId === n.id || otherId > n.id) return; // avoid dup
        if (Math.random() < 0.08) {
          links.push({ source: n.id, target: otherId, weight: 0.5 });
        }
      });
    });
  });

  // ── D3 SVG Graph ─────────────────────────────────────────
  const container = document.getElementById('graph-container');
  const width  = container.clientWidth  || 900;
  const height = container.clientHeight || 520;

  const svg = d3.select('#graph-container')
    .append('svg')
    .attr('width',  '100%')
    .attr('height', '100%')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('preserveAspectRatio', 'xMidYMid meet');

  // Defs: glow filter + arrow marker
  const defs = svg.append('defs');

  const glowFilter = defs.append('filter')
    .attr('id', 'glow')
    .attr('x', '-50%').attr('y', '-50%')
    .attr('width', '200%').attr('height', '200%');
  glowFilter.append('feGaussianBlur')
    .attr('stdDeviation', '3')
    .attr('result', 'coloredBlur');
  const feMerge = glowFilter.append('feMerge');
  feMerge.append('feMergeNode').attr('in', 'coloredBlur');
  feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

  // Zoom & pan
  const g = svg.append('g');

  const zoom = d3.zoom()
    .scaleExtent([0.3, 3.5])
    .on('zoom', (event) => {
      g.attr('transform', event.transform);
    });

  svg.call(zoom);

  // Click background to reset zoom
  svg.on('click', () => {
    svg.transition().duration(600).call(
      zoom.transform,
      d3.zoomIdentity.translate(width / 2, height / 2).scale(1).translate(-width / 2, -height / 2)
    );
  });

  // ── Tooltip ───────────────────────────────────────────────
  const tooltip = document.createElement('div');
  tooltip.className = 'node-tooltip';
  document.body.appendChild(tooltip);

  function showTooltip(event, node) {
    tooltip.innerHTML = `
      <div class="tooltip-name">${node.label}</div>
      <div class="tooltip-lang">${node.lang}${node.owner === 'org' ? ' · OriginalSoft' : ' · personal'}</div>
      <div class="tooltip-lang" style="margin-top:4px">Updated: ${node.updated}</div>
    `;
    tooltip.classList.add('visible');
    moveTooltip(event);
  }

  function moveTooltip(event) {
    const x = event.pageX + 14;
    const y = event.pageY - 40;
    tooltip.style.left = x + 'px';
    tooltip.style.top  = y + 'px';
  }

  function hideTooltip() {
    tooltip.classList.remove('visible');
  }

  // ── Force simulation ──────────────────────────────────────
  // Build node map
  const nodeMap = {};
  nodes.forEach(n => { nodeMap[n.id] = { ...n }; });

  const linkData = links.map(l => ({
    source: nodeMap[l.source] || l.source,
    target: nodeMap[l.target] || l.target,
    weight: l.weight || 1,
  })).filter(l => l.source && l.target);

  const simulation = d3.forceSimulation(Object.values(nodeMap))
    .force('link', d3.forceLink(linkData)
      .id(d => d.id)
      .distance(d => d.weight === 1 ? 80 : 120)
      .strength(d => d.weight * 0.3)
    )
    .force('charge', d3.forceManyBody()
      .strength(d => d.owner === 'org' ? -280 : -180)
      .distanceMax(400)
    )
    .force('center', d3.forceCenter(width / 2, height / 2).strength(0.08))
    .force('collide', d3.forceCollide(d => {
      const n = nodes.find(n => n.id === d.id);
      return (n ? n.size : 8) + 18;
    }))
    .alphaDecay(0.025);

  // ── Draw links ────────────────────────────────────────────
  const linkEl = g.append('g').attr('class', 'links')
    .selectAll('line')
    .data(linkData)
    .join('line')
    .attr('stroke', d => d.weight === 1 ? 'rgba(108,99,255,0.25)' : 'rgba(108,99,255,0.10)')
    .attr('stroke-width', d => d.weight === 1 ? 1.2 : 0.7);

  // ── Draw nodes ────────────────────────────────────────────
  const nodeEl = g.append('g').attr('class', 'nodes')
    .selectAll('g')
    .data(Object.values(nodeMap))
    .join('g')
    .attr('class', 'node')
    .style('cursor', 'pointer');

  // Outer ring (owner indicator)
  nodeEl.append('circle')
    .attr('r', d => (d.size || 8) + 4)
    .attr('fill', 'none')
    .attr('stroke', d => d.owner === 'org' ? 'rgba(0,212,170,0.3)' : 'rgba(108,99,255,0.15)')
    .attr('stroke-width', d => d.owner === 'org' ? 2 : 1.5)
    .attr('stroke-dasharray', d => d.owner === 'org' ? 'none' : '3,3');

  // Main circle
  nodeEl.append('circle')
    .attr('r', d => d.size || 8)
    .attr('fill', d => getLangColor(d.lang))
    .attr('fill-opacity', 0.85)
    .attr('stroke', d => d.owner === 'org' ? '#00d4aa' : '#6c63ff')
    .attr('stroke-width', 1.5)
    .attr('filter', 'url(#glow)');

  // Label (visible when zoomed in enough)
  nodeEl.append('text')
    .attr('text-anchor', 'middle')
    .attr('dy', d => (d.size || 8) + 14)
    .attr('fill', '#a0a0c0')
    .attr('font-size', '9px')
    .attr('font-family', 'JetBrains Mono, monospace')
    .attr('pointer-events', 'none')
    .text(d => d.label.length > 18 ? d.label.slice(0, 16) + '..' : d.label);

  // ── Interactions ─────────────────────────────────────────
  nodeEl
    .on('mouseenter', function (event, d) {
      d3.select(this).select('circle:nth-child(2)')
        .attr('stroke-width', 2.5)
        .attr('fill-opacity', 1);
      showTooltip(event, d);
    })
    .on('mousemove', moveTooltip)
    .on('mouseleave', function () {
      d3.select(this).select('circle:nth-child(2)')
        .attr('stroke-width', 1.5)
        .attr('fill-opacity', 0.85);
      hideTooltip();
    })
    .on('click', function (event, d) {
      event.stopPropagation();
      // Center on node
      const scale = 1.6;
      svg.transition().duration(500).ease(d3.easeQuadOut).call(
        zoom.transform,
        d3.zoomIdentity
          .translate(width / 2, height / 2)
          .scale(scale)
          .translate(-(d.x || width / 2), -(d.y || height / 2))
      );
    });

  // Drag
  const drag = d3.drag()
    .on('start', (event, d) => {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    })
    .on('drag', (event, d) => {
      d.fx = event.x;
      d.fy = event.y;
    })
    .on('end', (event, d) => {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    });

  nodeEl.call(drag);

  // ── Tick ─────────────────────────────────────────────────
  simulation.on('tick', () => {
    linkEl
      .attr('x1', d => d.source.x || 0)
      .attr('y1', d => d.source.y || 0)
      .attr('x2', d => d.target.x || 0)
      .attr('y2', d => d.target.y || 0);

    nodeEl.attr('transform', d => `translate(${d.x || 0},${d.y || 0})`);
  });

  // ── Entrance animation ────────────────────────────────────
  nodeEl.style('opacity', 0)
    .transition()
    .duration(600)
    .delay((d, i) => i * 20)
    .style('opacity', 1);

  // ── Zoom hint on first load ───────────────────────────────
  const hint = document.createElement('div');
  hint.style.cssText = `
    position: absolute; bottom: 60px; right: 20px;
    background: rgba(26,26,46,0.85); border: 1px solid #2a2a42;
    border-radius: 8px; padding: 8px 14px;
    font-family: 'JetBrains Mono', monospace; font-size: 11px;
    color: #7878a0; pointer-events: none; opacity: 0;
    transition: opacity 0.5s;
  `;
  hint.textContent = 'Scroll to zoom · Drag to pan · Click node to focus';
  container.style.position = 'relative';
  container.appendChild(hint);

  setTimeout(() => { hint.style.opacity = '1'; }, 1200);
  setTimeout(() => { hint.style.opacity = '0'; }, 4500);

})();
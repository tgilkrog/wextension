import { loadIcon } from './utils/svg-loader.js';

export const buttonGroups = Promise.all([
  loadIcon('house'),
  loadIcon('admin')
]).then(([house_svg, admin_svg]) => {
  const environments = [
    {
      label: 'Local',
      domain: (val) => `http://${val.trim()}.localhost/`
    },
    {
      label: 'Test',
      domain: (val) => {
        const v = val.trim();
        return /^https?:\/\//.test(v) ? v : `https://${v}-test.wexohosting.com`;
      }
    },
    {
      label: 'Staging',
      domain: (val) => {
        const v = val.trim();
        return /^https?:\/\//.test(v) ? v : `https://${v}-staging.wexohosting.com`;
      }
    },
    {
      label: 'Main',
      domain: (val) => {
        const v = val.trim();
        return /^https?:\/\//.test(v) ? v : `https://${v}.dk`;
      }
    }
  ];

  return environments.map(({ label, domain }) => ({
    label,
    buttons: [
      {
        icon: house_svg,
        title: `${label} Site`,
        name: 'main',
        buildUrl: domain
      },
      {
        icon: admin_svg,
        title: 'Admin',
        name: 'admin',
        buildUrl: (val) => {
          const url = domain(val).replace(/\/+$/, '');
          return `${url}/admin`;
        }
      }
    ]
  }));
});
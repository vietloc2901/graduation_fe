// These constants are injected via webpack DefinePlugin variables.
// You can add more variables in webpack.common.js or in profile specific webpack.<dev|prod>.js files.
// If you change the values in the webpack config files, you need to re run webpack to update the application

declare const __DEBUG_INFO_ENABLED__: boolean;
declare const __VERSION__: string;

export const VERSION = __VERSION__;
export const DEBUG_INFO_ENABLED = __DEBUG_INFO_ENABLED__;

export const NO_ROW_GRID_TEMPLATE = `
  <div>
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5.69873 25H30.2467V48H7.45215C6.98712 48 6.54113 47.8136 6.2123 47.4818C5.88347 47.15 5.69873 46.7 5.69873 46.2308V25Z" fill="#C1C4D6"/>
      <path d="M30.2466 25H42.5206V46.2308C42.5206 46.7 42.3358 47.15 42.007 47.4818C41.6782 47.8136 41.2322 48 40.7671 48H30.2466V25Z" fill="#8F95B2"/>
      <path d="M30.2466 25L35.726 31.1923H48L42.5206 25H30.2466Z" fill="#D8DAE5"/>
      <path d="M30.4658 25L24.9863 31.1923H0L5.47945 25H30.4658Z" fill="#D8DAE5"/>
      <path d="M24 20C29.5228 20 34 15.5228 34 10C34 4.47715 29.5228 0 24 0C18.4772 0 14 4.47715 14 10C14 15.5228 18.4772 20 24 20Z" fill="#C1C4D6"/>
      <path d="M23.7475 6.84449L24.0657 7.3131L24.3827 6.84449C24.5962 6.62203 24.8523 6.44481 25.1358 6.32338C25.4192 6.20196 25.7242 6.13881 26.0325 6.13771C26.3409 6.13661 26.6463 6.19756 26.9306 6.31696C27.2149 6.43635 27.4723 6.61173 27.6874 6.83266L27.7514 6.89359C28.2155 7.3479 28.4821 7.9666 28.4937 8.61593C28.5053 9.26526 28.2608 9.89307 27.8132 10.3636L27.7514 10.4267L24.0657 14.0274L20.4712 10.4267C20.2361 10.1965 20.0493 9.92169 19.9217 9.61834C19.7942 9.31499 19.7285 8.98923 19.7285 8.66017C19.7285 8.3311 19.7942 8.00534 19.9217 7.70199C20.0493 7.39864 20.2361 7.1238 20.4712 6.89359C20.6743 6.66067 20.9242 6.4731 21.2045 6.34306C21.4848 6.21301 21.7894 6.14342 22.0984 6.13879C22.4074 6.13416 22.7139 6.1946 22.998 6.31618C23.2821 6.43776 23.5375 6.61777 23.7475 6.84449Z" fill="white"/>
      <defs>
      <clipPath id="clip0">
      <rect width="48" height="48" fill="white"/>
      </clipPath>
      </defs>
    </svg>
    <p style='margin-top: 6px;'>{{field}}</p>
  </div>
`.replace('{{field}}', 'Chưa có thông tin')

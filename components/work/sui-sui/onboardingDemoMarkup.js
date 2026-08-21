// suisui — Onboarding 演示的 DOM 標記，逐字取自
// all-ui-animation/suisui-onboarding-demo/suisui-onboarding-demo.html
// 的 <body> 內容（SVG symbol defs + .stage），只拿掉了 dev-only 的
// .hint 提示文字（已經沒有任何腳本引用它，見 public/onboarding-demo.js
// 檔頭說明）。不要手動編輯這段內容——要換圖示/文案，回 Figma 匯出後
// 整段替換，比照原始檔案自己的註解說明。
export const ONBOARDING_DEMO_MARKUP = `
<!-- ============================================================
     素材區 —— 要換圖只改這裡，下面的畫面會自動跟著換
     從 Figma 匯出 SVG 後，把 <symbol> 裡面的內容整段換掉即可
     （viewBox 記得一起換成匯出檔的 viewBox）
     ============================================================ -->
<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>

  <!-- 品牌 LOGO — 直接來自 Figma 匯出的 logo.svg -->
  <symbol id="ic-logo" viewBox="0 0 166 265">
<path d="M82.8643 0C128.629 0.000162145 165.729 37.0997 165.729 82.8643V181.208L165.701 183.348C164.566 228.123 127.913 264.072 82.8643 264.072C37.0996 264.072 0 226.973 0 181.208V82.8643C2.75766e-06 37.0996 37.0996 0 82.8643 0ZM82.8643 6.37402C40.62 6.37402 6.37403 40.62 6.37402 82.8643V181.208C6.37402 223.452 40.62 257.698 82.8643 257.698C125.108 257.698 159.354 223.452 159.354 181.208V82.8643C159.354 40.6201 125.108 6.37419 82.8643 6.37402ZM82.8643 12.748C122.594 12.7482 154.8 46.2659 154.801 87.6113V176.462L154.777 178.393C153.793 218.845 121.973 251.324 82.8643 251.324C43.7553 251.324 11.935 218.846 10.9502 178.393L10.9268 176.462V87.6113C10.9272 46.2657 43.1348 12.748 82.8643 12.748ZM82.8643 16.3906C45.282 16.3906 14.5698 48.1391 14.5693 87.6113V176.462C14.57 215.934 45.2821 247.682 82.8643 247.682C85.4147 247.682 87.9334 247.534 90.4131 247.249C59.6627 233.434 38.2451 202.54 38.2451 166.639C38.2451 157.751 39.9232 148.596 42.7949 139.83C42.7112 139.939 42.6275 140.045 42.542 140.146L41.7939 140.2C34.0781 140.562 26.8801 135.533 24.7988 127.767L24.6777 127.278C23.4834 122.231 24.7106 117.146 27.6328 113.28C35.6271 112.545 43.2268 117.646 45.375 125.663L45.4971 126.153C45.9276 128.045 45.9601 130.068 45.7109 132.008C49.3597 123.298 54.1173 115.209 59.4551 108.452C57.3152 101.933 56.1922 95.5255 59.083 82.9277C63.8808 68.4651 75.8484 58.3983 89.7266 55.3594C89.7521 55.3888 89.7773 55.4187 89.8027 55.4482C93.3832 54.8785 100.235 54.4424 100.235 54.4424C106.708 58.8575 111.689 64.976 114.772 71.96C116.94 72.342 119.663 72.9274 121.53 73.5469C128.226 75.768 133.979 79.5272 138.53 84.2998C140.411 90.6792 139.858 99.6542 138.099 107.281C137.457 110.064 136.395 112.72 135.177 115.305C135.217 115.431 135.256 115.557 135.293 115.683C134.73 116.738 134.123 117.76 133.479 118.75L133.432 118.848C133.43 118.843 133.427 118.839 133.426 118.834C123.343 134.263 103.804 141.622 85.4854 135.546L84.3076 135.135C73.4689 131.182 65.2274 123.146 60.7451 113.358C48.9516 127.911 41.8877 146.447 41.8877 166.639C41.8877 169.197 42.0006 171.728 42.2227 174.229C43.9395 164.238 50.9921 155.508 61.3008 152.146C65.6693 150.722 70.5253 150.633 74.8809 151.352C79.217 152.067 83.2535 153.615 85.9492 155.657L86.543 156.106L86.6514 156.846C88.604 170.2 80.728 183.416 67.4609 187.742C59.2416 190.422 50.6815 189.122 43.8643 184.912C50.0901 213.219 70.4777 236.217 97.2246 246.1C127.964 239.23 151.158 210.764 151.158 176.462V87.6113C151.158 48.1392 120.446 16.3908 82.8643 16.3906ZM74.2871 154.946C70.3623 154.299 66.1188 154.407 62.4307 155.609C51.1445 159.29 44.3357 170.361 45.6143 181.714C51.5849 185.465 59.1093 186.634 66.332 184.279C77.6322 180.594 84.441 169.501 83.1406 158.133C81.0254 156.732 77.8701 155.537 74.2871 154.946ZM29.627 116.861C27.9481 119.778 27.3796 123.323 28.3174 126.823C29.8509 132.546 34.9372 136.372 40.5684 136.564C41.0619 135.64 41.5346 134.415 41.8506 132.98C42.3308 130.801 42.3685 128.517 41.8564 126.605C40.3246 120.889 35.2497 117.062 29.627 116.861ZM108.02 93.541C90.7409 87.8093 72.2637 95.1773 63.3682 110.241C67.4013 120.228 75.6191 128.435 86.6318 132.089C103.937 137.829 122.441 130.427 131.32 115.316C129.949 111.758 127.19 107.522 123.369 103.597C119.061 99.1703 113.678 95.4184 108.02 93.541ZM118.86 76.5605C118.957 77.052 119.05 77.5812 119.129 78.1318C119.351 79.6868 119.533 81.5798 119.671 83.5918C119.903 86.98 120.018 90.8505 119.973 94.2568C123.201 96.9307 126.453 100.479 129.259 104.21C130.737 106.175 132.13 108.244 133.354 110.32C133.841 109.037 134.25 107.758 134.549 106.464C136.16 99.4788 136.617 91.6644 135.261 86.168C131.215 82.123 126.192 78.9308 120.384 77.0039C119.935 76.8549 119.417 76.7066 118.86 76.5605ZM88.3467 59.457C76.6505 62.7449 66.7493 71.5645 62.5928 83.9209C60.928 91.2402 60.7313 96.1455 61.2129 100.103C61.4026 101.661 61.7019 103.102 62.082 104.53C70.3837 93.6948 82.7864 87.2464 96.6328 87.3037C96.9985 77.703 93.7844 66.7584 88.3467 59.457ZM98.21 71.665C99.7985 77.0946 100.537 82.8321 100.24 88.1699C103.217 88.4731 106.208 89.1027 109.166 90.084L110.349 90.502C112.411 91.2743 114.416 92.2567 116.338 93.3975C116.377 86.3165 115.742 77.4541 114.823 75.6221C114.775 75.526 114.687 75.2504 114.573 74.8799C114.517 74.8732 114.469 74.8635 114.431 74.8467L114.419 74.8428C113.47 74.4186 112.896 74.1606 112.1 73.8701L111.207 73.5615C108.079 72.5238 101.663 71.9254 98.21 71.665ZM98.6631 58.2031C97.5689 58.2842 96.1086 58.3996 94.6299 58.54C93.9822 58.6015 93.3405 58.6684 92.7314 58.7363C93.3011 59.8167 93.9702 61.0312 94.668 62.2607C95.7217 64.1173 96.8027 65.9566 97.624 67.334C97.7643 67.5692 97.8982 67.7905 98.0215 67.9961C99.1292 68.0763 100.627 68.1974 102.262 68.3623C104.432 68.5812 107.052 68.9018 109.339 69.3516C106.768 65.0232 103.337 61.1986 99.1895 58.1641C99.0264 58.1758 98.8498 58.1893 98.6631 58.2031Z" fill="#FAFAF8"/>
  </symbol>

  <!-- 箭頭圖示 — 直接來自 Figma 匯出的 arrow.svg -->
  <symbol id="ic-arrow" viewBox="0 0 36 30">
<path fill-rule="evenodd" clip-rule="evenodd" d="M21.6553 0.789062C21.6553 2.90467 22.3043 6.11447 24.2012 8.74902C25.9842 11.2251 28.9277 13.2873 33.8037 13.415L35.0762 13.4307V16.5791H34.2871C29.1183 16.5791 26.0401 18.6976 24.2012 21.251C22.3043 23.8855 21.6553 27.0953 21.6553 29.2109V30H18.4971V29.2109C18.4971 26.59 19.2708 22.6937 21.6367 19.4072C22.376 18.3804 23.2694 17.4189 24.333 16.5791H0V13.4209H24.333C23.2694 12.5811 22.376 11.6196 21.6367 10.5928C19.2708 7.30635 18.4971 3.41 18.4971 0.789062V0H21.6553V0.789062Z" fill="white"/>
  </symbol>

  <!-- 鬱金香插畫 — 直接來自 Figma 匯出的 tulips.svg -->
  <symbol id="ic-tulips" viewBox="0 0 370 516">
<mask id="mask0_1652_819" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="370" height="516">
<path d="M0 0H370V476L189.5 516L0 476V0Z" fill="#D9D9D9"/>
</mask>
<g mask="url(#mask0_1652_819)">
<path d="M179.566 391.866C133.144 319.359 114.232 311.323 86.9899 308.977C86.4735 308.933 86.0052 309.292 85.9182 309.803L83.4497 324.29C83.2496 325.464 85.7086 326.287 86.5178 325.413C108.053 302.149 152.835 399.417 184.598 481.542C184.95 482.453 186.965 482.706 187.676 482.037C195.369 474.796 220.83 456.316 179.566 391.866Z" fill="#86C504"/>
<path d="M105.609 225.043C99.8435 229.76 101.023 237.054 102.333 240.111L119.367 250.593L123.953 225.043C124.389 224.169 123.297 221.767 115.436 219.146C107.574 216.526 105.609 221.985 105.609 225.043Z" fill="#8F0018"/>
<path d="M120.022 228.973C114.257 234.739 114.126 240.111 114.781 242.076L158.675 286.626C164.135 268.282 170.074 228.187 150.158 214.56C130.242 200.933 121.769 218.491 120.022 228.973Z" fill="url(#paint0_linear_1652_819)"/>
<path d="M151.44 225.14C146.9 233.343 148.2 239.867 149.418 242.104L190.183 286.433C200.774 246.485 172.334 216.836 156.79 207.004C149.283 210.887 150.096 220.713 151.44 225.14Z" fill="#B8001F"/>
<path d="M114.126 240.766C117.27 240.766 123.298 246.881 125.918 249.938L158.02 318.072C121.987 325.279 102.988 282.695 97.0919 276.143C92.375 270.902 92.0692 258.236 92.506 252.558C90.4095 237.359 94.6897 236.18 97.0919 237.49C101.46 238.582 110.981 240.766 114.126 240.766Z" fill="#B8001F"/>
<g filter="url(#filter0_d_1652_819)">
<path d="M115.436 273.523C127.301 323.048 160.451 321.625 176.275 314.487C176.777 314.261 177.235 313.955 177.641 313.582C193.346 299.175 191.398 277.991 188.811 268.937C186.191 259.765 163.261 239.456 160.64 242.076C158.762 243.955 142.363 243.168 131.905 242.356C129.811 242.193 127.767 243.105 126.581 244.838C116.778 259.174 115.025 269.826 115.436 273.523Z" fill="#D42035"/>
</g>
<path d="M196.907 340.668C192.414 315.115 179.522 300.107 173.639 295.798L164.01 302.642C181.341 308.118 186.209 337.372 186.476 351.315V499.546L196.907 513.304C198.779 466.406 201.4 366.221 196.907 340.668Z" fill="#165E1C"/>
<path d="M105.609 225.043C99.8435 229.76 101.023 237.054 102.333 240.111L119.367 250.593L123.953 225.043C124.389 224.169 123.297 221.767 115.436 219.146C107.574 216.526 105.609 221.985 105.609 225.043Z" fill="#8F0018"/>
<path d="M120.022 228.973C114.257 234.739 114.126 240.111 114.781 242.076L158.675 286.626C164.135 268.282 170.074 228.187 150.158 214.56C130.242 200.933 121.769 218.491 120.022 228.973Z" fill="url(#paint1_linear_1652_819)"/>
<path d="M151.44 225.14C146.9 233.343 148.2 239.867 149.418 242.104L190.183 286.433C200.774 246.485 172.334 216.836 156.79 207.004C149.283 210.887 150.096 220.713 151.44 225.14Z" fill="#B8001F"/>
<path d="M114.126 240.766C117.27 240.766 123.298 246.881 125.918 249.938L158.02 318.072C121.987 325.279 102.988 282.695 97.0919 276.143C92.375 270.902 92.0692 258.236 92.506 252.558C90.4095 237.359 94.6897 236.18 97.0919 237.49C101.46 238.582 110.981 240.766 114.126 240.766Z" fill="#B8001F"/>
<g filter="url(#filter1_d_1652_819)">
<path d="M115.436 273.523C127.301 323.048 160.451 321.625 176.275 314.487C176.777 314.261 177.235 313.955 177.641 313.582C193.346 299.175 191.398 277.991 188.811 268.937C186.191 259.765 163.261 239.456 160.64 242.076C158.762 243.955 142.363 243.168 131.905 242.356C129.811 242.193 127.767 243.105 126.581 244.838C116.778 259.174 115.025 269.826 115.436 273.523Z" fill="#D42035"/>
</g>
<path d="M205.249 252.238C212.392 214.354 227.03 192.806 233.456 186.768L242.577 197.656C224.373 204.654 216.478 248.044 214.806 268.865L198.545 510.97L187.92 510.256C190.72 440.035 198.107 290.122 205.249 252.238Z" fill="#6FA109"/>
<path d="M331.256 99.7394C338.053 106.107 335.971 115.108 334.08 118.813L311.951 130.463L308.37 98.2023C307.899 97.076 309.462 94.1706 319.49 91.56C329.518 88.9494 331.512 95.9252 331.256 99.7394Z" fill="#8F0018"/>
<path d="M312.945 103.436C319.655 111.111 319.368 117.824 318.386 120.222L259.892 172.122C254.618 148.78 250.567 98.2608 276.555 82.929C302.544 67.5973 311.644 90.2119 312.945 103.436Z" fill="url(#paint2_linear_1652_819)"/>
<path d="M274.07 96.021C279.047 106.635 276.878 114.666 275.171 117.354L220.6 169.242C210.734 118.516 248.699 83.9095 268.915 72.9468C277.955 78.4191 276.118 90.6097 274.07 96.021Z" fill="#B8001F"/>
<path d="M319.313 118.642C315.39 118.378 307.358 125.502 303.833 129.096L258.074 211.41C302.424 223.42 329.695 171.885 337.6 164.205C343.924 158.062 345.366 142.286 345.297 135.165C349.186 116.379 343.945 114.549 340.838 115.982C335.298 116.979 323.236 118.905 319.313 118.642Z" fill="#B8001F"/>
<g filter="url(#filter2_d_1652_819)">
<path d="M314.934 159.399C295.921 220.385 254.48 215.608 235.417 205.309C234.932 205.047 234.497 204.712 234.115 204.315C215.563 185.01 219.78 158.637 223.776 147.529C227.814 136.306 258.123 112.89 261.173 116.379C263.407 118.935 284.787 119.289 297.846 119.126C299.946 119.099 301.924 120.153 303.002 121.954C314.428 141.038 315.767 154.762 314.934 159.399Z" fill="#D42035"/>
</g>
<path d="M194.029 166.44C186.887 128.556 119.862 142.706 113.435 136.668L108.798 151.16C127.002 158.159 181.909 150.051 183.581 170.871L200.734 425.172L211.359 424.458C208.558 354.237 201.172 204.324 194.029 166.44Z" fill="#527608"/>
<path d="M68.8771 102.637C65.4738 111.308 71.2203 118.541 74.519 121.075L99.5067 122.091L88.8838 91.4198C88.8259 90.2 86.1661 88.2478 75.9892 90.1972C65.8124 92.1467 67.0075 99.303 68.8771 102.637Z" fill="#8F0018"/>
<path d="M87.0004 98.1105C84.2381 107.924 87.3804 113.863 89.2968 115.606L164.413 137.352C159.15 114.006 141.109 66.6448 111.055 63.9619C80.9998 61.279 82.4956 85.6097 87.0004 98.1105Z" fill="url(#paint3_linear_1652_819)"/>
<path d="M118.923 74.7171C118.987 86.4401 124.395 92.7604 127.091 94.4552L198.659 117.874C185.781 67.828 136.632 52.8826 113.667 51.6658C107.854 60.4902 114.748 70.7102 118.923 74.7171Z" fill="#B8001F"/>
<path d="M87.7809 114.578C91.2106 112.655 101.524 115.638 106.251 117.37L182.929 172.05C148.037 201.944 101.274 167.118 90.8373 163.579C82.4877 160.747 74.4087 147.12 71.4129 140.66C59.8318 125.365 63.7789 121.461 67.2001 121.422C72.6313 119.942 84.3512 116.501 87.7809 114.578Z" fill="#B8001F"/>
<g filter="url(#filter3_d_1652_819)">
<path d="M109.241 149.503C152.606 196.41 187.978 174.297 200.769 156.809C201.094 156.364 201.343 155.875 201.517 155.352C209.98 129.951 194.844 107.945 186.464 99.6305C177.997 91.2296 140.569 83.1014 139.313 87.5621C138.394 90.8295 119.238 100.332 107.375 105.794C105.467 106.673 104.134 108.473 103.933 110.564C101.812 132.705 106.498 145.673 109.241 149.503Z" fill="#D42035"/>
</g>
<path d="M225.911 350.139C190.062 403.811 192.924 471.038 198.837 497.943C225.216 432.629 278.957 296.415 282.89 274.066C286.823 251.716 299.724 220.168 305.683 207.187C279.86 237.731 241.742 315.215 225.911 350.139Z" fill="#165E1C"/>
<path d="M188.115 505.628L195.761 530.103C210.424 495.575 242.15 422.796 251.741 407.899C261.331 393.001 287.124 276.353 298.822 219.891L188.115 505.628Z" fill="#86C504"/>
<path d="M226.146 349.607C190.389 403.307 193.231 470.563 199.123 497.478C225.438 432.132 279.05 295.85 282.975 273.49C286.901 251.131 299.772 219.566 305.716 206.579C279.961 237.141 241.938 314.665 226.146 349.607Z" fill="#165E1C"/>
<path d="M192.408 518.545C200.07 495.606 206.774 437.744 172.296 389.809C167.026 378.677 149.413 367.264 127.863 355.928C121.843 339.323 117.761 326.818 116.989 321.584C114.29 303.309 38.612 309.044 24.8564 300.308C24.1953 299.675 23.5758 299.045 22.9999 298.418C23.3348 299.116 23.9658 299.742 24.8564 300.308C42.7458 317.427 91.0491 336.564 127.863 355.928C144.224 401.059 174.905 476.478 192.408 518.545Z" fill="#165E1C"/>
<path d="M187.557 505.556L195.218 530.074C209.911 495.486 241.699 422.58 251.308 407.656C260.918 392.732 286.761 275.879 298.482 219.318L187.557 505.556Z" fill="#86C504"/>
<g filter="url(#filter4_n_1652_819)">
<path d="M179.566 391.866C133.144 319.359 114.232 311.323 86.9899 308.977C86.4735 308.933 86.0052 309.292 85.9182 309.803L83.4497 324.29C83.2496 325.464 85.7086 326.287 86.5178 325.413C108.053 302.149 152.835 399.417 184.598 481.542C184.95 482.453 186.965 482.706 187.676 482.037C195.369 474.796 220.83 456.316 179.566 391.866Z" fill="#86C504"/>
<path d="M105.609 225.043C99.8435 229.76 101.023 237.054 102.333 240.111L119.367 250.593L123.953 225.043C124.389 224.169 123.297 221.767 115.436 219.146C107.574 216.526 105.609 221.985 105.609 225.043Z" fill="#8F0018"/>
<path d="M120.022 228.973C114.257 234.739 114.126 240.111 114.781 242.076L158.675 286.626C164.135 268.282 170.074 228.187 150.158 214.56C130.242 200.933 121.769 218.491 120.022 228.973Z" fill="url(#paint4_linear_1652_819)"/>
<path d="M151.44 225.14C146.9 233.343 148.2 239.867 149.418 242.104L190.183 286.433C200.774 246.485 172.334 216.836 156.79 207.004C149.283 210.887 150.096 220.713 151.44 225.14Z" fill="#B8001F"/>
<path d="M114.126 240.766C117.27 240.766 123.298 246.881 125.918 249.938L158.02 318.072C121.987 325.279 102.988 282.695 97.0919 276.143C92.375 270.902 92.0692 258.236 92.506 252.558C90.4095 237.359 94.6897 236.18 97.0919 237.49C101.46 238.582 110.981 240.766 114.126 240.766Z" fill="#B8001F"/>
<g filter="url(#filter5_d_1652_819)">
<path d="M115.436 273.523C127.301 323.048 160.451 321.625 176.275 314.487C176.777 314.261 177.235 313.955 177.641 313.582C193.346 299.175 191.398 277.991 188.811 268.937C186.191 259.765 163.261 239.456 160.64 242.076C158.762 243.955 142.363 243.168 131.905 242.356C129.811 242.193 127.767 243.105 126.581 244.838C116.778 259.174 115.025 269.826 115.436 273.523Z" fill="#D42035"/>
</g>
<path d="M196.907 340.668C192.414 315.115 179.522 300.107 173.639 295.798L164.01 302.642C181.341 308.118 186.209 337.372 186.476 351.315V499.546L196.907 513.304C198.779 466.406 201.4 366.221 196.907 340.668Z" fill="#165E1C"/>
<path d="M105.609 225.043C99.8435 229.76 101.023 237.054 102.333 240.111L119.367 250.593L123.953 225.043C124.389 224.169 123.297 221.767 115.436 219.146C107.574 216.526 105.609 221.985 105.609 225.043Z" fill="#8F0018"/>
<path d="M120.022 228.973C114.257 234.739 114.126 240.111 114.781 242.076L158.675 286.626C164.135 268.282 170.074 228.187 150.158 214.56C130.242 200.933 121.769 218.491 120.022 228.973Z" fill="url(#paint5_linear_1652_819)"/>
<path d="M151.44 225.14C146.9 233.343 148.2 239.867 149.418 242.104L190.183 286.433C200.774 246.485 172.334 216.836 156.79 207.004C149.283 210.887 150.096 220.713 151.44 225.14Z" fill="#B8001F"/>
<path d="M114.126 240.766C117.27 240.766 123.298 246.881 125.918 249.938L158.02 318.072C121.987 325.279 102.988 282.695 97.0919 276.143C92.375 270.902 92.0692 258.236 92.506 252.558C90.4095 237.359 94.6897 236.18 97.0919 237.49C101.46 238.582 110.981 240.766 114.126 240.766Z" fill="#B8001F"/>
<g filter="url(#filter6_d_1652_819)">
<path d="M115.436 273.523C127.301 323.048 160.451 321.625 176.275 314.487C176.777 314.261 177.235 313.955 177.641 313.582C193.346 299.175 191.398 277.991 188.811 268.937C186.191 259.765 163.261 239.456 160.64 242.076C158.762 243.955 142.363 243.168 131.905 242.356C129.811 242.193 127.767 243.105 126.581 244.838C116.778 259.174 115.025 269.826 115.436 273.523Z" fill="#D42035"/>
</g>
<path d="M205.249 252.238C212.392 214.354 227.03 192.806 233.456 186.768L242.577 197.656C224.373 204.654 216.478 248.044 214.806 268.865L198.545 510.97L187.92 510.256C190.72 440.035 198.107 290.122 205.249 252.238Z" fill="#6FA109"/>
<path d="M331.256 99.7394C338.053 106.107 335.971 115.108 334.08 118.813L311.951 130.463L308.37 98.2023C307.899 97.076 309.462 94.1706 319.49 91.56C329.518 88.9494 331.512 95.9252 331.256 99.7394Z" fill="#8F0018"/>
<path d="M312.945 103.436C319.655 111.111 319.368 117.824 318.386 120.222L259.892 172.122C254.618 148.78 250.567 98.2608 276.555 82.929C302.544 67.5973 311.644 90.2119 312.945 103.436Z" fill="url(#paint6_linear_1652_819)"/>
<path d="M274.07 96.021C279.047 106.635 276.878 114.666 275.171 117.354L220.6 169.242C210.734 118.516 248.699 83.9095 268.915 72.9468C277.955 78.4191 276.118 90.6097 274.07 96.021Z" fill="#B8001F"/>
<path d="M319.313 118.642C315.39 118.378 307.358 125.502 303.833 129.096L258.074 211.41C302.424 223.42 329.695 171.885 337.6 164.205C343.924 158.062 345.366 142.286 345.297 135.165C349.186 116.379 343.945 114.549 340.838 115.982C335.298 116.979 323.236 118.905 319.313 118.642Z" fill="#B8001F"/>
<g filter="url(#filter7_d_1652_819)">
<path d="M314.934 159.399C295.921 220.385 254.48 215.608 235.417 205.309C234.932 205.047 234.497 204.712 234.115 204.315C215.563 185.01 219.78 158.637 223.776 147.529C227.814 136.306 258.123 112.89 261.173 116.379C263.407 118.935 284.787 119.289 297.846 119.126C299.946 119.099 301.924 120.153 303.002 121.954C314.428 141.038 315.767 154.762 314.934 159.399Z" fill="#D42035"/>
</g>
<path d="M194.029 166.44C186.887 128.556 119.862 142.706 113.435 136.668L108.798 151.16C127.002 158.159 181.909 150.051 183.581 170.871L200.734 425.172L211.359 424.458C208.558 354.237 201.172 204.324 194.029 166.44Z" fill="#527608"/>
<path d="M68.8771 102.637C65.4738 111.308 71.2203 118.541 74.519 121.075L99.5067 122.091L88.8838 91.4198C88.8259 90.2 86.1661 88.2478 75.9892 90.1972C65.8124 92.1467 67.0075 99.303 68.8771 102.637Z" fill="#8F0018"/>
<path d="M87.0004 98.1105C84.2381 107.924 87.3804 113.863 89.2968 115.606L164.413 137.352C159.15 114.006 141.109 66.6448 111.055 63.9619C80.9998 61.279 82.4956 85.6097 87.0004 98.1105Z" fill="url(#paint7_linear_1652_819)"/>
<path d="M118.923 74.7171C118.987 86.4401 124.395 92.7604 127.091 94.4552L198.659 117.874C185.781 67.828 136.632 52.8826 113.667 51.6658C107.854 60.4902 114.748 70.7102 118.923 74.7171Z" fill="#B8001F"/>
<path d="M87.7809 114.578C91.2106 112.655 101.524 115.638 106.251 117.37L182.929 172.05C148.037 201.944 101.274 167.118 90.8373 163.579C82.4877 160.747 74.4087 147.12 71.4129 140.66C59.8318 125.365 63.7789 121.461 67.2001 121.422C72.6313 119.942 84.3512 116.501 87.7809 114.578Z" fill="#B8001F"/>
<g filter="url(#filter8_d_1652_819)">
<path d="M109.241 149.503C152.606 196.41 187.978 174.297 200.769 156.809C201.094 156.364 201.343 155.875 201.517 155.352C209.98 129.951 194.844 107.945 186.464 99.6305C177.997 91.2296 140.569 83.1014 139.313 87.5621C138.394 90.8295 119.238 100.332 107.375 105.794C105.467 106.673 104.134 108.473 103.933 110.564C101.812 132.705 106.498 145.673 109.241 149.503Z" fill="#D42035"/>
</g>
<path d="M225.911 350.139C190.062 403.811 192.924 471.038 198.837 497.943C225.216 432.629 278.957 296.415 282.89 274.066C286.823 251.716 299.724 220.168 305.683 207.187C279.86 237.731 241.742 315.215 225.911 350.139Z" fill="#165E1C"/>
<path d="M188.115 505.628L195.761 530.103C210.424 495.575 242.15 422.796 251.741 407.899C261.331 393.001 287.124 276.353 298.822 219.891L188.115 505.628Z" fill="#86C504"/>
<path d="M226.146 349.607C190.389 403.307 193.231 470.563 199.123 497.478C225.438 432.132 279.05 295.85 282.975 273.49C286.901 251.131 299.772 219.566 305.716 206.579C279.961 237.141 241.938 314.665 226.146 349.607Z" fill="#165E1C"/>
<path d="M192.408 518.545C200.07 495.606 206.774 437.744 172.296 389.809C167.026 378.677 149.413 367.264 127.863 355.928C121.843 339.323 117.761 326.818 116.989 321.584C114.29 303.309 38.612 309.044 24.8564 300.308C24.1953 299.675 23.5758 299.045 22.9999 298.418C23.3348 299.116 23.9658 299.742 24.8564 300.308C42.7458 317.427 91.0491 336.564 127.863 355.928C144.224 401.059 174.905 476.478 192.408 518.545Z" fill="#165E1C"/>
<path d="M187.557 505.556L195.218 530.074C209.911 495.486 241.699 422.58 251.308 407.656C260.918 392.732 286.761 275.879 298.482 219.318L187.557 505.556Z" fill="#86C504"/>
</g>
</g>
<defs>
<filter id="filter0_d_1652_819" x="99.3813" y="229.845" width="107.182" height="108.307" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="4"/>
<feGaussianBlur stdDeviation="8"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1652_819"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1652_819" result="shape"/>
</filter>
<filter id="filter1_d_1652_819" x="99.3813" y="229.845" width="107.182" height="108.307" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="4"/>
<feGaussianBlur stdDeviation="8"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1652_819"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1652_819" result="shape"/>
</filter>
<filter id="filter2_d_1652_819" x="204.326" y="104.028" width="126.809" height="127.508" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="4"/>
<feGaussianBlur stdDeviation="8"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1652_819"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1652_819" result="shape"/>
</filter>
<filter id="filter3_d_1652_819" x="87.3981" y="74.2973" width="132.61" height="123.314" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="4"/>
<feGaussianBlur stdDeviation="8"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1652_819"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1652_819" result="shape"/>
</filter>
<filter id="filter4_n_1652_819" x="22.9999" y="51.6658" width="323.678" height="478.437" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feTurbulence type="fractalNoise" baseFrequency="2 2" stitchTiles="stitch" numOctaves="3" result="noise" seed="3638" />
<feColorMatrix in="noise" type="luminanceToAlpha" result="alphaNoise" />
<feComponentTransfer in="alphaNoise" result="coloredNoise1">
<feFuncA type="discrete" tableValues="1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 "/>
</feComponentTransfer>
<feComposite operator="in" in2="shape" in="coloredNoise1" result="noise1Clipped" />
<feFlood flood-color="rgba(0, 0, 0, 0.25)" result="color1Flood" />
<feComposite operator="in" in2="noise1Clipped" in="color1Flood" result="color1" />
<feMerge result="effect1_noise_1652_819">
<feMergeNode in="shape" />
<feMergeNode in="color1" />
</feMerge>
</filter>
<filter id="filter5_d_1652_819" x="99.3813" y="229.845" width="107.182" height="108.307" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="4"/>
<feGaussianBlur stdDeviation="8"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1652_819"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1652_819" result="shape"/>
</filter>
<filter id="filter6_d_1652_819" x="99.3813" y="229.845" width="107.182" height="108.307" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="4"/>
<feGaussianBlur stdDeviation="8"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1652_819"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1652_819" result="shape"/>
</filter>
<filter id="filter7_d_1652_819" x="204.326" y="104.028" width="126.809" height="127.508" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="4"/>
<feGaussianBlur stdDeviation="8"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1652_819"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1652_819" result="shape"/>
</filter>
<filter id="filter8_d_1652_819" x="87.3981" y="74.2973" width="132.61" height="123.314" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="4"/>
<feGaussianBlur stdDeviation="8"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1652_819"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1652_819" result="shape"/>
</filter>
<linearGradient id="paint0_linear_1652_819" x1="125.918" y1="215.871" x2="167.847" y2="263.041" gradientUnits="userSpaceOnUse">
<stop offset="0.0142207" stop-color="#8F0018"/>
<stop offset="0.664849" stop-color="#290007"/>
</linearGradient>
<linearGradient id="paint1_linear_1652_819" x1="125.918" y1="215.871" x2="167.847" y2="263.041" gradientUnits="userSpaceOnUse">
<stop offset="0.0142207" stop-color="#8F0018"/>
<stop offset="0.664849" stop-color="#290007"/>
</linearGradient>
<linearGradient id="paint2_linear_1652_819" x1="306.687" y1="86.5949" x2="250.425" y2="141.93" gradientUnits="userSpaceOnUse">
<stop offset="0.0142207" stop-color="#8F0018"/>
<stop offset="0.664849" stop-color="#290007"/>
</linearGradient>
<linearGradient id="paint3_linear_1652_819" x1="85.4184" y1="80.2143" x2="159.994" y2="106.02" gradientUnits="userSpaceOnUse">
<stop offset="0.0142207" stop-color="#8F0018"/>
<stop offset="0.664849" stop-color="#290007"/>
</linearGradient>
<linearGradient id="paint4_linear_1652_819" x1="125.918" y1="215.871" x2="167.847" y2="263.041" gradientUnits="userSpaceOnUse">
<stop offset="0.0142207" stop-color="#8F0018"/>
<stop offset="0.664849" stop-color="#290007"/>
</linearGradient>
<linearGradient id="paint5_linear_1652_819" x1="125.918" y1="215.871" x2="167.847" y2="263.041" gradientUnits="userSpaceOnUse">
<stop offset="0.0142207" stop-color="#8F0018"/>
<stop offset="0.664849" stop-color="#290007"/>
</linearGradient>
<linearGradient id="paint6_linear_1652_819" x1="306.687" y1="86.5949" x2="250.425" y2="141.93" gradientUnits="userSpaceOnUse">
<stop offset="0.0142207" stop-color="#8F0018"/>
<stop offset="0.664849" stop-color="#290007"/>
</linearGradient>
<linearGradient id="paint7_linear_1652_819" x1="85.4184" y1="80.2143" x2="159.994" y2="106.02" gradientUnits="userSpaceOnUse">
<stop offset="0.0142207" stop-color="#8F0018"/>
<stop offset="0.664849" stop-color="#290007"/>
</linearGradient>
</defs>
  </symbol>

</defs></svg>
<div class="stage">
  <div class="phone">
    <div class="screen" id="screen">

      <!-- ===== 狀態列 ===== -->
      <div class="statusbar hidden" id="statusbar">
        <span>9:41</span>
        <span class="sb-right">
          <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor"><rect x="0" y="8" width="3" height="4" rx="1"/><rect x="5" y="5.5" width="3" height="6.5" rx="1"/><rect x="10" y="3" width="3" height="9" rx="1"/><rect x="15" y="0" width="3" height="12" rx="1"/></svg>
          <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor"><path d="M8 11.2 5.6 8.6a3.4 3.4 0 0 1 4.8 0L8 11.2Zm0-5.4a6 6 0 0 0-4.3 1.8L2.2 6.1a8.2 8.2 0 0 1 11.6 0l-1.5 1.5A6 6 0 0 0 8 5.8Zm0-4a10 10 0 0 0-7.1 2.9L-.6 3.2a12.2 12.2 0 0 1 17.2 0l-1.5 1.5A10 10 0 0 0 8 1.8Z"/></svg>
          <svg width="25" height="12" viewBox="0 0 25 12" fill="none"><rect x=".5" y=".5" width="21" height="11" rx="3.2" stroke="currentColor" stroke-opacity=".38"/><rect x="2" y="2" width="17" height="8" rx="2" fill="currentColor"/><path d="M23 4.2v3.6c.9-.3 1.5-1 1.5-1.8s-.6-1.5-1.5-1.8Z" fill="currentColor" fill-opacity=".38"/></svg>
        </span>
      </div>

      <!-- ===== 共用進度條 ===== -->
      <div class="track" id="track"><div class="track-fill" id="track-fill"></div></div>

      <!-- ===== S1 · Logo ===== -->
      <section class="scr" id="s-logo">
        <svg class="mark"><use href="#ic-logo"/></svg>
      </section>

      <!-- ===== S2 · introduce ===== -->
      <section class="scr" id="s-intro">
        <div class="abs h-italic" style="left:25px;top:116px;width:334px">
          Start today.<br>Do it for yourself.
        </div>
        <div class="abs body-lora" style="left:24px;top:212px;width:371px;font-size:18px">
          Simple, gentle, and made just for you.<br>No experience needed — just follow along.
        </div>
        <svg class="abs" viewBox="0 0 370 516" style="left:8px;top:269px;width:370px;height:516px"><use href="#ic-tulips"/></svg>
        <div class="btn-primary" id="intro-btn" style="left:24px;top:774px;width:354px">
          <svg class="arrow"><use href="#ic-arrow"/></svg>
        </div>
      </section>

      <!-- ===== S3 · log in（含數字鍵盤，兩張原稿合併成一個連續動作） ===== -->
      <section class="scr" id="s-login">
        <div class="abs h-display" style="left:25px;top:115px">Hello, welcome!</div>
        <div class="abs body-lora" style="left:24px;top:165px;width:373px">
          Enter your phone number and we'll text you a sign-in code.
        </div>

        <div class="field" style="left:16px;top:245px;width:88px;justify-content:center;gap:7px">
          <span style="font-size:22px;line-height:1">🇬🇧</span>
          <svg width="11" height="7" viewBox="0 0 11 7" fill="none" stroke="#1a1a1a" stroke-width="1.6" stroke-linecap="round"><path d="M1 1.2 5.5 5.6 10 1.2"/></svg>
        </div>
        <div class="field" id="phone-field" style="left:112px;top:245px;width:274px;padding-left:24px">
          <span class="ph" id="phone-ph">Phone number</span>
          <span class="val" id="phone-val"></span><span class="caret" id="phone-caret" style="display:none"></span>
        </div>

        <div class="btn-primary" id="code-btn" style="left:16px;top:342px;width:370px">Send code</div>

        <div class="abs" style="left:24px;top:549px;width:354px;display:flex;align-items:center;gap:12px">
          <span style="flex:1;height:1px;background:#d9d9d9"></span>
          <span style="font-family:'DM Sans';font-weight:200;font-size:16px;color:#4c4c4c">Or continue with</span>
          <span style="flex:1;height:1px;background:#d9d9d9"></span>
        </div>

        <div class="social" style="left:37px">
          <!-- SWAP ▸ Google 標誌佔位（近似） -->
          <svg width="22" height="22" viewBox="0 0 48 48"><path fill="#4285F4" d="M45 24.5c0-1.6-.1-2.7-.4-4H24v7.6h12c-.2 2-1.5 5-4.4 7l6.7 5.2C42.2 36.6 45 31.1 45 24.5Z"/><path fill="#34A853" d="M24 46c5.9 0 10.9-2 14.5-5.3l-6.9-5.4c-1.9 1.3-4.4 2.2-7.6 2.2-5.8 0-10.7-3.8-12.5-9.1l-7.1 5.5C8 41.2 15.4 46 24 46Z"/><path fill="#FBBC05" d="M11.5 28.4c-.5-1.4-.7-2.9-.7-4.4s.3-3 .7-4.4l-7.1-5.5A22 22 0 0 0 2 24c0 3.6.9 6.9 2.4 9.9l7.1-5.5Z"/><path fill="#EA4335" d="M24 9.5c4.1 0 6.9 1.8 8.5 3.3l6.2-6C34.9 3.4 29.9 1 24 1 15.4 1 8 5.8 4.4 14.1l7.1 5.5C13.3 14.3 18.2 9.5 24 9.5Z"/></svg>
          Google
        </div>
        <div class="social" style="left:210px">
          <svg width="24" height="24" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#1877F2"/><path fill="#fff" d="M21.4 20.6l.7-4.6h-4.4v-3c0-1.3.6-2.5 2.6-2.5h2V6.6s-1.8-.3-3.6-.3c-3.7 0-6.1 2.2-6.1 6.3V16h-4v4.6h4V32h5v-11.4h3.8Z"/></svg>
          Facebook
        </div>

        <div class="keypad" id="keypad">
          <div class="key" data-k="1"><span class="n">1</span><span class="l">&nbsp;</span></div>
          <div class="key" data-k="2"><span class="n">2</span><span class="l">ABC</span></div>
          <div class="key" data-k="3"><span class="n">3</span><span class="l">DEF</span></div>
          <div class="key" data-k="4"><span class="n">4</span><span class="l">GHI</span></div>
          <div class="key" data-k="5"><span class="n">5</span><span class="l">JKL</span></div>
          <div class="key" data-k="6"><span class="n">6</span><span class="l">MNO</span></div>
          <div class="key" data-k="7"><span class="n">7</span><span class="l">PQRS</span></div>
          <div class="key" data-k="8"><span class="n">8</span><span class="l">TUV</span></div>
          <div class="key" data-k="9"><span class="n">9</span><span class="l">WXYZ</span></div>
          <div class="key blank"></div>
          <div class="key" data-k="0"><span class="n">0</span><span class="l">&nbsp;</span></div>
          <div class="key blank" data-k="del"><svg width="26" height="19" viewBox="0 0 26 19" fill="none" stroke="#000" stroke-width="1.6"><path d="M8 1.5h15a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H8L1 9.5 8 1.5Z"/><path d="m12 6.5 7 6M19 6.5l-7 6" stroke-linecap="round"/></svg></div>
          <div class="homebar"></div>
        </div>
      </section>

      <!-- ===== S4 · font size ===== -->
      <section class="scr" id="s-size">
        <div class="abs h-italic" style="left:24px;top:137px;width:362px">Choose your text size</div>
        <div class="abs body-lg" style="left:24px;top:184px;width:362px">You can change this anytime in Settings</div>

        <div class="sizecard" id="card-s" style="top:237px">
          <span class="t1" style="top:26px;font-size:32px">Morning Glow</span>
          <span class="t2" style="top:69px;font-size:16px">Toner + Moisturiser</span>
          <span class="radio" style="top:44px"></span>
        </div>
        <div class="sizecard" id="card-m" style="top:378px">
          <span class="t1" style="top:20px;font-size:36px">Morning Glow</span>
          <span class="t2" style="top:69px;font-size:20px">Toner + Moisturiser</span>
          <span class="radio" style="top:44px"></span>
        </div>
        <div class="sizecard" id="card-l" style="top:518px">
          <span class="t1" style="top:16px;font-size:40px">Morning Glow</span>
          <span class="t2" style="top:69px;font-size:24px">Toner + Moisturiser</span>
          <span class="radio" style="top:44px"></span>
        </div>

        <div class="btn-primary" id="size-next" style="left:16px;top:774px;width:370px">
          Next <svg class="arrow"><use href="#ic-arrow"/></svg>
        </div>
      </section>

      <!-- ===== S5 · 問卷 1 ===== -->
      <section class="scr" id="s-q1">
        <div class="abs h-italic" style="left:26px;top:135px;width:370px">What's your current skincare routine?</div>
        <div class="opt" id="q1-a" style="top:237px">Daily</div>
        <div class="opt" id="q1-b" style="top:313px">Occasionally</div>
        <div class="opt" id="q1-c" style="top:389px">Only when I remember</div>
        <div class="opt" id="q1-d" style="top:465px">Rarely or never</div>
        <div class="btn-primary" id="q1-next" style="left:16px;top:774px;width:370px">
          Next <svg class="arrow"><use href="#ic-arrow"/></svg>
        </div>
      </section>

      <!-- ===== S6 · 問卷 2（複選） ===== -->
      <section class="scr" id="s-q2">
        <div class="abs h-italic" style="left:27px;top:138px;width:350px">What's your main goal?</div>
        <div class="opt" id="q2-a" style="top:217px">Reduce dryness</div>
        <div class="opt" id="q2-b" style="top:293px">Look more energised</div>
        <div class="opt" id="q2-c" style="top:369px">Learn makeup</div>
        <div class="opt" id="q2-d" style="top:445px">Build a daily self-care routine</div>
        <div class="opt" id="q2-e" style="top:521px">Keep my hands and mind active</div>
        <div class="opt" id="q2-f" style="top:597px;letter-spacing:-.8px">Find skincare that suits my age</div>
        <div class="opt" id="q2-g" style="top:673px">Slow down signs of ageing</div>
        <div class="opt" id="q2-h" style="top:749px;font-size:19px;text-align:center;line-height:1.15;padding:0 40px">Even out skin tone and dullness</div>
        <div class="btn-primary" id="q2-next" style="left:16px;top:774px;width:370px">
          Next <svg class="arrow"><use href="#ic-arrow"/></svg>
        </div>
      </section>

      <!-- ===== S7 · 提醒設定 ===== -->
      <section class="scr" id="s-remind">
        <div class="abs h-italic" style="left:24px;top:137px;width:354px;font-size:31px;line-height:32px">Set your daily reminder</div>
        <div class="abs body-lg" style="left:24px;top:184px;width:354px">When would you like to start your skincare practice each day?</div>

        <div class="abs" style="left:0;right:0;top:271px;text-align:center;font-family:'DM Sans';font-weight:700;font-size:36px;color:var(--neutral-800)">
          <span id="mini-h">06</span>:<span id="mini-m">00</span>
        </div>
        <div class="abs" style="left:0;right:0;top:321px;text-align:center;font-family:'DM Sans';font-size:16px;color:var(--neutral-500)">Reminder Time</div>

        <div class="timecard">
          <div class="wheel" style="left:44px"><div class="wheel-inner" id="wheel-h"></div></div>
          <div class="colon">:</div>
          <div class="wheel" style="left:215px"><div class="wheel-inner" id="wheel-m"></div></div>
        </div>

        <div class="infobar">
          <svg width="23" height="23" viewBox="0 0 23 23" fill="none" stroke="#2a2a2a" stroke-width="1.5"><circle cx="11.5" cy="11.5" r="8.5"/><circle cx="11.5" cy="7.2" r=".9" fill="#2a2a2a"/><path d="M11.5 9.8v6.6" stroke-linecap="round"/></svg>
          You can change this anytime in Settings.
        </div>

        <div class="btn-primary" id="rm-next" style="left:16px;top:774px;width:370px">
          Next <svg class="arrow"><use href="#ic-arrow"/></svg>
        </div>
      </section>


      <div class="cursor" id="cursor"></div>
    </div>
  </div>

  <div class="caption" id="caption"></div>

  <div class="controls" id="controls">
    <button id="btn-play">⏸ 暫停</button>
    <button id="btn-replay">↻ 重播</button>
    <div class="sep"></div>
    <button class="spd" data-s="0.5">0.5×</button>
    <button class="spd on" data-s="1">1×</button>
    <button class="spd" data-s="1.5">1.5×</button>
    <div class="sep"></div>
    <button id="btn-loop" class="on">🔁 循環</button>
  </div>
</div>

`;

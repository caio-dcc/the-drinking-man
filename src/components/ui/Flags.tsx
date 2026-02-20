import React from "react";

export const FlagBR = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 72 50"
    className={className}
    fill="none"
  >
    <rect width="72" height="50" fill="#009C3B" rx="2" />
    <path fill="#FFDF00" d="M36 4.167L64.8 25 36 45.833 7.2 25z" />
    <circle cx="36" cy="25" r="10.5" fill="#002776" />
    <path
      fill="#FFF"
      fillRule="evenodd"
      d="M26.5 25c0-5.247 4.253-9.5 9.5-9.5s9.5 4.253 9.5 9.5-4.253 9.5-9.5 9.5-9.5-4.253-9.5-9.5zm9.5-8.5c-4.694 0-8.5 3.806-8.5 8.5s3.806 8.5 8.5 8.5 8.5-3.806 8.5-8.5-3.806-8.5-8.5-8.5z"
      clipRule="evenodd"
      opacity=".1"
    />
  </svg>
);

export const FlagUS = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 72 50"
    className={className}
    fill="none"
  >
    <rect width="72" height="50" fill="#B22234" rx="2" />
    <path
      fill="#FFF"
      d="M0 7.692h72v7.692H0zm0 15.385h72v7.692H0zm0 15.385h72V46.154H0z"
    />
    <rect width="28.8" height="26.923" fill="#3C3B6E" rx="1" />
  </svg>
);

export const FlagES = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 72 50"
    className={className}
    fill="none"
  >
    <rect width="72" height="50" fill="#AA151B" rx="2" />
    <rect y="12.5" width="72" height="25" fill="#F1BF00" />
  </svg>
);

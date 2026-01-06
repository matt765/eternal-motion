import * as React from "react";
import Link from "next/link";

import styles from "../../styles/Logo.module.scss";
import { LogoIcon } from "../../../assets/icons/LogoIcon";

interface Props {
  isSideMenuOpen: boolean;
  isMobile?: boolean;
}

export const Logo = ({ isSideMenuOpen, isMobile }: Props) => {
  const containerClasses = [
    styles.logoContainer,
    isMobile ? styles.logoContainerMobile : styles.logoContainerDefault,
    isSideMenuOpen ? styles.logoOpen : styles.logoClosed,
  ].join(" ");

  return (
    <Link href="/" className={containerClasses}>
      <div style={{ display: "flex", alignItems: "center" }}>
        {/* Inner flex container for image and text */}
        <div className={styles.imageContainer}>
          <LogoIcon />
        </div>
        {isSideMenuOpen && (
          <div className={styles.logoTextContainer}>
            <span className={styles.logoTextFirst}>Eternal</span>
            <span className={styles.logoTextSecond}>Motion</span>
          </div>
        )}
      </div>
    </Link>
  );
};

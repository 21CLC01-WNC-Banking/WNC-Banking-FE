"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import ReCAPTCHA from "react-google-recaptcha";

const useCaptcha = () => {
    const [captchaToken, setCaptchaToken] = useState<string>("");
    const captchaRef = useRef<ReCAPTCHA | null>(null);

    const handleCaptcha = useCallback((token: string | null) => {
        setCaptchaToken(token || "");
    }, []);

    const refreshCaptcha = () => {
        if (captchaRef.current && captchaToken) {
            captchaRef.current.reset();
            setCaptchaToken("");
        }
    };

    useEffect(() => {
        let tokenRefreshTimeout: NodeJS.Timeout | null = null;

        if (captchaToken) {
            tokenRefreshTimeout = setTimeout(refreshCaptcha, 110000); // 110 seconds
        }

        return () => {
            if (tokenRefreshTimeout) {
                clearTimeout(tokenRefreshTimeout);
            }
        };
    }, [captchaToken]);

    return {
        captchaToken,
        setCaptchaToken,
        captchaRef,
        handleCaptcha,
        refreshCaptcha,
    };
};

export default useCaptcha;

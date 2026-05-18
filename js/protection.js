/**
 * 網站程式碼保護腳本
 * 功能：禁用右鍵、文字選擇、快捷鍵等基礎保護措施
 * 注意：此腳本無法完全防止專業開發者查看原始碼，主要用於增加一般使用者的複製難度
 */

(function() {
    'use strict';

    // ==================== 1. 禁用右鍵選單 ====================
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
    });

    // ==================== 2. 禁用文字選擇 ====================
    document.addEventListener('selectstart', function(e) {
        e.preventDefault();
        return false;
    });

    // 針對不同瀏覽器的文字選擇禁用
    document.addEventListener('dragstart', function(e) {
        e.preventDefault();
        return false;
    });

    // ==================== 3. 禁用常用快捷鍵 ====================
    document.addEventListener('keydown', function(e) {
        // 禁用 F12（開發者工具）
        if (e.keyCode === 123) {
            e.preventDefault();
            return false;
        }

        // 禁用 Ctrl+Shift+I（開發者工具）
        if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
            e.preventDefault();
            return false;
        }

        // 禁用 Ctrl+Shift+J（控制台）
        if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
            e.preventDefault();
            return false;
        }

        // 禁用 Ctrl+Shift+C（檢查元素）
        if (e.ctrlKey && e.shiftKey && e.keyCode === 67) {
            e.preventDefault();
            return false;
        }

        // 禁用 Ctrl+U（查看原始碼）
        if (e.ctrlKey && e.keyCode === 85) {
            e.preventDefault();
            return false;
        }

        // 禁用 Ctrl+S（儲存網頁）
        if (e.ctrlKey && e.keyCode === 83) {
            e.preventDefault();
            return false;
        }

        // 禁用 Ctrl+A（全選）
        if (e.ctrlKey && e.keyCode === 65) {
            e.preventDefault();
            return false;
        }

        // 禁用 Ctrl+P（列印）
        // 注意：此功能可能影響正常使用者，可選擇性啟用
        // if (e.ctrlKey && e.keyCode === 80) {
        //     e.preventDefault();
        //     return false;
        // }

        // 禁用 Ctrl+C（複製）
        // 注意：此功能會嚴重影響使用者體驗，不建議啟用
        // if (e.ctrlKey && e.keyCode === 67) {
        //     e.preventDefault();
        //     return false;
        // }
    });

    // ==================== 4. 偵測開發者工具（進階） ====================
    // 注意：此功能可能影響正常使用者，請謹慎使用

    let devtools = {
        open: false,
        orientation: null
    };

    const threshold = 160;

    setInterval(function() {
        if (window.outerHeight - window.innerHeight > threshold || 
            window.outerWidth - window.innerWidth > threshold) {
            if (!devtools.open) {
                devtools.open = true;
                // 可選：當偵測到開發者工具時執行的動作
                // console.clear();
                // document.body.innerHTML = '';
                // 或顯示警告訊息
                // alert('開發者工具已開啟');
            }
        } else {
            if (devtools.open) {
                devtools.open = false;
            }
        }
    }, 500);

    // ==================== 5. 防止圖片拖曳 ====================
    document.addEventListener('dragstart', function(e) {
        if (e.target.tagName === 'IMG') {
            e.preventDefault();
            return false;
        }
    });

    // ==================== 6. 防止複製到剪貼簿 ====================
    // 注意：此功能會影響正常使用者體驗，請謹慎使用
    document.addEventListener('copy', function(e) {
        // 可選：完全禁止複製
        // e.clipboardData.setData('text/plain', '');
        // e.preventDefault();
        // return false;
        
        // 或：允許複製但加入浮水印
        const selection = window.getSelection().toString();
        if (selection.length > 10) {
            e.clipboardData.setData('text/plain', 
                selection + '\n\n---\n來源：Ivan Zhao Portfolio Website\n版權所有，未經授權禁止轉載');
        }
    });

    // ==================== 7. 防止截圖（部分瀏覽器支援） ====================
    // 注意：此功能僅在部分瀏覽器中有效，且可能影響無障礙功能
    if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
        // 可選：監聽螢幕分享事件
        // 此功能需要使用者授權，無法完全防止
    }

    // ==================== 8. 防止 iframe 嵌入 ====================
    // 防止網站被嵌入到其他網站的 iframe 中
    if (window.top !== window.self) {
        window.top.location = window.self.location;
    }

    // ==================== 9. 控制台警告訊息 ====================
    // 當開發者開啟控制台時顯示警告
    const style = 'font-size: 20px; font-weight: bold; color: #ff0000;';
    console.log('%c警告！', style);
    console.log('%c這是瀏覽器的開發者功能。', 'font-size: 14px;');
    console.log('%c如果您不確定您在做什麼，請不要在此處輸入任何內容。', 'font-size: 14px;');
    console.log('%c惡意使用者可能會利用此功能來竊取您的資訊或危害您的帳戶。', 'font-size: 14px; color: #ff0000;');

    // ==================== 10. 防止除錯器附加 ====================
    // 使用無限迴圈干擾除錯器（進階，可能影響效能）
    // 注意：此功能可能影響網站效能，請謹慎使用
    /*
    (function() {
        function detectDevTools() {
            const start = performance.now();
            debugger;
            const end = performance.now();
            if (end - start > 100) {
                // 偵測到除錯器
                console.clear();
                document.body.innerHTML = '<h1>偵測到除錯工具</h1>';
            }
        }
        setInterval(detectDevTools, 1000);
    })();
    */

    console.log('%c保護腳本已載入', 'color: #00ff00; font-weight: bold;');
})();


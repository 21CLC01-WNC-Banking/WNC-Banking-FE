(function () {
    const default_numbers = ' hai ba bốn năm sáu bảy tám chín';
    const dict = {
        units: ('? một' + default_numbers).split(' '),
        tens: ('lẻ mười' + default_numbers).split(' '),
        hundreds: ('không một' + default_numbers).split(' '),
    };
    const tram = 'trăm';
    const digits = 'x nghìn triệu tỉ nghìn'.split(' ');

    function tenth(block_of_2) {
        let sl1 = dict.units[block_of_2[1]];
        const result = [dict.tens[block_of_2[0]]];
        if (block_of_2[0] > 0 && block_of_2[1] == 5) sl1 = 'lăm';
        if (block_of_2[0] > 1) {
            result.push('mươi');
            if (block_of_2[1] == 1) sl1 = 'mốt';
        }
        if (sl1 != '?') result.push(sl1);
        return result.join(' ');
    }

    function block_of_three(block) {
        switch (block.length) {
            case 1: return dict.units[block];
            case 2: return tenth(block);
            case 3: {
                const result = [dict.hundreds[block[0]], tram];
                if (block.slice(1, 3) != '00') {
                    const sl12 = tenth(block.slice(1, 3));
                    result.push(sl12);
                }
                return result.join(' ');
            }
        }
        return '';
    }

    function to_vietnamese(input, currency) {
        const str = parseInt(input) + '';
        let index = str.length;
        if (index === 0 || str === 'NaN') return '';
        const arr = [];
        const result = [];
        while (index >= 0) {
            arr.push(str.substring(index, Math.max(index - 3, 0)));
            index -= 3;
        }
        let digit_counter = 0;
        for (let i = arr.length - 1; i >= 0; i--) {
            if (arr[i] == '000') {
                digit_counter += 1;
            } else if (arr[i] != '') {
                digit_counter = 0;
                result.push(block_of_three(arr[i]));
                const digit = digits[i];
                if (digit && digit != 'x') result.push(digit);
            }
        }
        if (currency) result.push(currency);
        return result.join(' ');
    }

    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        module.exports = to_vietnamese;
    } else if (typeof window !== 'undefined') {
        window.to_vietnamese = to_vietnamese;
    }
})();

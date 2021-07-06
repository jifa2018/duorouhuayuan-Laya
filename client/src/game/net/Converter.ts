export class Converter {
    /**
     * 获取字符串的字节长度
     * @param str 字符串
     * @return 返回字符串的字节长度
     */
    public static GetBytesLengthForString(str) {
        if (str === void 0) { return -1; };
        let len = 0;
        for (var i = 0, sz = str.length; i < sz; i++) {
            var c = str.charCodeAt(i);
            if (c <= 0x7F) {
                len = len + 1;
            }
            else if (c <= 0x7FF) {
                len = len + 2;
            }
            else if (c <= 0xFFFF) {
                len = len + 3;
            }
            else {
                len = len + 4;
            }
        }
        return len;
    }

    /**
     * string转二进制字节数组
     * @param str 字符串
     * @return 字节数组
     */
    public static StringToBytes(str) {
        let ch, st, re = [];
        for (let i = 0; i < str.length; i++) {
            ch = str.charCodeAt(i);
            st = [];
            do {
                st.push(ch & 0xFF);
                ch = ch >> 8;
            }
            while (ch);
            re = re.concat(st.reverse());
        }
        return re;
    }

    //生成函数名hash值
    public static GetBKDRHash(str: string): number {
        let seed: number = 131;
        let hash: number = 0;
        let strlen: number = str.length;

        for (let i: number = 0; i < strlen; ++i) {
            hash = (hash * seed + str.charCodeAt(i)) & 0x7FFFFFFF;
        }
        return hash;
    }
}
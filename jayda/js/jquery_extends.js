(function($) {
    $.extend({
        splitAttrString: function(theStr) {
            var attrs = [];

            var RefString = function(s) {
                this.value = s;
            };
            RefString.prototype.toString = function() {
                return this.value;
            };
            RefString.prototype.charAt = String.prototype.charAt;
            var data = new RefString(theStr);

            var getBlock = function(endChr, restString) {
                var block = '';
                var currChr = '';
                while ((currChr != endChr) && (restString.value !== '')) {
                    if (/'|"/.test(currChr)) {
                        block = $.trim(block) + getBlock(currChr, restString);
                    }
                    else if (/\{/.test(currChr)) {
                        block = $.trim(block) + getBlock('}', restString);
                    }
                    else if (/\[/.test(currChr)) {
                        block = $.trim(block) + getBlock(']', restString);
                    }
                    else {
                        block += currChr;
                    }
                    currChr = restString.charAt(0);
                    restString.value = restString.value.slice(1);
                }
                return $.trim(block);
            };

            do {
                var attr = getBlock(',', data);
                attrs.push(attr);
            }
            while (data.value !== '');
            return attrs;
        }
    });
})(jQuery);
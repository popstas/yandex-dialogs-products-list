#encoding "utf-8"

DayOfWeek -> Noun<kwtype="день_недели">;      // используем слова из статьи "день_недели"
Day -> AnyWord<wff=/([0-2]?[0-9])|(3[0-1])/>; // число от 1 до 31
Month -> Noun<kwtype="месяц">;                // используем слова из статьи "месяц"
// MonthNum -> AnyWord<wff=/(0?[0-9])|(1[1-2])/>;// используем слова из статьи "месяц"
YearDescr -> "год" | "г. ";
Year -> AnyWord<wff=/[1-2]?[0-9]{1,3}г?\.?/>; // число от 0 до 2999 с возможным "г" или "г." в конце
Year -> Year YearDescr;


        // - 01.02.2003
// Date -> Day interp (Date.Day) Punct
//         MonthNum interp (Date.Month) Punct
//         Year interp (Date.Year);

        // вчера, завтра
Date -> Word<kwtype="когда"> interp (Date.Day);

        // день недели, запятая, число, месяц и год:
        // "понедельник, 3 сентября 2012г."
Date -> DayOfWeek interp (Date.DayOfWeek) (Comma)
        Day interp (Date.Day)
        Month interp (Date.Month)
        (Year interp (Date.Year));

        // число, месяц и год: "10 января 2011"
Date -> Day interp (Date.Day)
        Month interp (Date.Month)
        (Year interp (Date.Year));

        // месяц и год: "июнь 2009"
Date -> Month interp (Date.Month)
        Year interp (Date.Year);

        // - день недели: "во вторник"
Date -> "в" ("прошлый"<gnc-agr[1]>) ("следующий"<gnc-agr[1]>) DayOfWeek<gram="ед, вин", gnc-agr[1]> interp (Date.DayOfWeek);
Date -> "во" DayOfWeek<gram="ед, вин"> interp (Date.DayOfWeek);

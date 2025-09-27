import { describe, expect, it, test } from "vitest";
import { Format } from "../src";

describe("Format Class", () => {
	describe("ptBR Functions", () => {
		describe("cnpj", () => {
			it("should format a valid CNPJ", () => {
				expect(Format.ptBr.cnpj("12.345.678/0001-00")).toBe("12.345.678/0001-00");
				expect(Format.ptBr.cnpj("12345678000195")).toBe("12.345.678/0001-95");
				expect(Format.ptBr.cnpj("12345678901234")).toBe("12.345.678/9012-34");
			});

			it("should return the fallback message for an invalid CNPJ length", () => {
				expect(Format.ptBr.cnpj("1234567890")).toBe("CNPJ com formato incorreto!");
				expect(Format.ptBr.cnpj("123456789012345")).toBe("CNPJ com formato incorreto!");
				expect(Format.ptBr.cnpj("100345678000195", "Verifique o CNPJ informado")).toBe("Verifique o CNPJ informado");
			});

			it("should return the fallback message for a non-string input", () => {
				expect(Format.ptBr.cnpj(undefined as unknown as string)).toBe("CNPJ com formato incorreto!");
				expect(Format.ptBr.cnpj(null as unknown as string)).toBe("CNPJ com formato incorreto!");
			});
		});

		describe("cpf", () => {
			it("should format a valid CPF", () => {
				expect(Format.ptBr.cpf("12345678909")).toBe("123.456.789-09");
			});

			it("should return the fallback value for an invalid CPF", () => {
				expect(Format.ptBr.cpf("1234567890")).toBe("CPF com formato incorreto!");
				expect(Format.ptBr.cpf("123456789")).toBe("CPF com formato incorreto!");
				expect(Format.ptBr.cpf("123456789012")).toBe("CPF com formato incorreto!");
			});
		});

		describe("cep", () => {
			it("should format a valid CEP", () => {
				expect(Format.ptBr.cep("12345678")).toBe("12345-678");
			});

			it("should return the fallback value for an invalid CEP", () => {
				expect(Format.ptBr.cep("1234567")).toBe("CEP com formato incorreto!");
				expect(Format.ptBr.cep("1234567", "05145-000")).toBe("05145-000");
			});

			it("should return the fallback value for an empty CEP", () => {
				expect(Format.ptBr.cep("")).toBe("CEP com formato incorreto!");
				expect(Format.ptBr.cep("", "Nenhum valor fornecido")).toBe("Nenhum valor fornecido");
			});

			it("should return value for a CEP with non-numeric characters", () => {
				expect(Format.ptBr.cep("meu cep é 12345 digitos 678")).toBe("12345-678");
			});
		});

		describe("telefone", () => {
			it("should return formatted number with raw value of length 8", () => {
				expect(Format.ptBr.telefone("12345678")).toBe("1234-5678");
			});

			it("should format a phone number with DDD if it has 8 or 9 digits", () => {
				expect(Format.ptBr.telefone("11987654321")).toBe("11 98765-4321");
				expect(Format.ptBr.telefone("987654321", "11")).toBe("11 98765-4321");
			});

			it("should return the fallback message if the phone number has less than 8 or more than 11 digits", () => {
				expect(Format.ptBr.telefone("", "")).toBe("Telefone com formato incorreto!");
				expect(Format.ptBr.telefone("1234", "")).toBe("Telefone com formato incorreto!");
				expect(Format.ptBr.telefone("123abc456", "")).toBe("Telefone com formato incorreto!");
				expect(Format.ptBr.telefone("1234567890123", "")).toBe("Telefone com formato incorreto!");
			});

			it("should use the default area code if it is provided", () => {
				expect(Format.ptBr.telefone("987654321", "21")).toBe("21 98765-4321");
			});

			it("should format a phone number with DDD if it has 10 or 11 digits", () => {
				expect(Format.ptBr.telefone("1123456789")).toBe("11 2345-6789");
				expect(Format.ptBr.telefone("111234556788", "11")).toBe("Telefone com formato incorreto!");
			});

			it("should throw error with non-numeric characters", () => {
				expect(Format.ptBr.telefone("123abc456", "", "Nº de telefone incorreto")).toBe("Nº de telefone incorreto");
			});
		});

		describe("valorPorExtenso", () => {
			test("should singularize and pluralize the value", () => {
				expect(Format.ptBr.valorPorExtenso(1)).toBe("um");
				expect(Format.ptBr.valorPorExtenso(2)).toBe("dois");
				expect(Format.ptBr.valorPorExtenso(3)).toBe("três");
				expect(Format.ptBr.valorPorExtenso(4)).toBe("quatro");
				expect(Format.ptBr.valorPorExtenso(5)).toBe("cinco");
				expect(Format.ptBr.valorPorExtenso(6)).toBe("seis");
				expect(Format.ptBr.valorPorExtenso(7)).toBe("sete");
				expect(Format.ptBr.valorPorExtenso(8)).toBe("oito");
				expect(Format.ptBr.valorPorExtenso(9)).toBe("nove");
				expect(Format.ptBr.valorPorExtenso(10)).toBe("dez");
				expect(Format.ptBr.valorPorExtenso(11)).toBe("onze");
				expect(Format.ptBr.valorPorExtenso(12)).toBe("doze");
				expect(Format.ptBr.valorPorExtenso(13)).toBe("treze");
				expect(Format.ptBr.valorPorExtenso(14)).toBe("quatorze");
				expect(Format.ptBr.valorPorExtenso(15)).toBe("quinze");
				expect(Format.ptBr.valorPorExtenso(16)).toBe("dezesseis");
				expect(Format.ptBr.valorPorExtenso(17)).toBe("dezessete");
				expect(Format.ptBr.valorPorExtenso(18)).toBe("dezoito");
				expect(Format.ptBr.valorPorExtenso(19)).toBe("dezenove");

				expect(Format.ptBr.valorPorExtenso(20)).toBe("vinte");
				expect(Format.ptBr.valorPorExtenso(21)).toBe("vinte e um");
				expect(Format.ptBr.valorPorExtenso(22)).toBe("vinte e dois");

				expect(Format.ptBr.valorPorExtenso(30)).toBe("trinta");
				expect(Format.ptBr.valorPorExtenso(31)).toBe("trinta e um");
				expect(Format.ptBr.valorPorExtenso(33)).toBe("trinta e três");

				expect(Format.ptBr.valorPorExtenso(40)).toBe("quarenta");
				expect(Format.ptBr.valorPorExtenso(41)).toBe("quarenta e um");
				expect(Format.ptBr.valorPorExtenso(44)).toBe("quarenta e quatro");

				expect(Format.ptBr.valorPorExtenso(50)).toBe("cinquenta");
				expect(Format.ptBr.valorPorExtenso(51)).toBe("cinquenta e um");
				expect(Format.ptBr.valorPorExtenso(55)).toBe("cinquenta e cinco");

				expect(Format.ptBr.valorPorExtenso(60)).toBe("sessenta");
				expect(Format.ptBr.valorPorExtenso(61)).toBe("sessenta e um");
				expect(Format.ptBr.valorPorExtenso(66)).toBe("sessenta e seis");

				expect(Format.ptBr.valorPorExtenso(70)).toBe("setenta");
				expect(Format.ptBr.valorPorExtenso(71)).toBe("setenta e um");
				expect(Format.ptBr.valorPorExtenso(75)).toBe("setenta e cinco");

				expect(Format.ptBr.valorPorExtenso(80)).toBe("oitenta");
				expect(Format.ptBr.valorPorExtenso(81)).toBe("oitenta e um");
				expect(Format.ptBr.valorPorExtenso(85)).toBe("oitenta e cinco");

				expect(Format.ptBr.valorPorExtenso(90)).toBe("noventa");
				expect(Format.ptBr.valorPorExtenso(91)).toBe("noventa e um");
				expect(Format.ptBr.valorPorExtenso(95)).toBe("noventa e cinco");

				expect(Format.ptBr.valorPorExtenso(100)).toBe("cem");
				expect(Format.ptBr.valorPorExtenso(101)).toBe("cento e um");
				expect(Format.ptBr.valorPorExtenso(110)).toBe("cento e dez");

				expect(Format.ptBr.valorPorExtenso(200)).toBe("duzentos");
				expect(Format.ptBr.valorPorExtenso(300)).toBe("trezentos");
				expect(Format.ptBr.valorPorExtenso(400)).toBe("quatrocentos");
				expect(Format.ptBr.valorPorExtenso(500)).toBe("quinhentos");
				expect(Format.ptBr.valorPorExtenso(600)).toBe("seiscentos");
				expect(Format.ptBr.valorPorExtenso(700)).toBe("setecentos");
				expect(Format.ptBr.valorPorExtenso(800)).toBe("oitocentos");
				expect(Format.ptBr.valorPorExtenso(900)).toBe("novecentos");

				expect(Format.ptBr.valorPorExtenso(1000)).toBe("mil");
				expect(Format.ptBr.valorPorExtenso(1100)).toBe("mil e cem");
				expect(Format.ptBr.valorPorExtenso(2000)).toBe("dois mil");
				expect(Format.ptBr.valorPorExtenso(2100)).toBe("dois mil e cem");
				expect(Format.ptBr.valorPorExtenso(3000)).toBe("três mil");
				expect(Format.ptBr.valorPorExtenso(3100)).toBe("três mil e cem");

				expect(Format.ptBr.valorPorExtenso(100_000)).toBe("cem mil");
				expect(Format.ptBr.valorPorExtenso(110_000)).toBe("cento e dez mil");

				expect(Format.ptBr.valorPorExtenso(1_000_000)).toBe("um milhão");
				expect(Format.ptBr.valorPorExtenso(2_000_000)).toBe("dois milhões");

				expect(Format.ptBr.valorPorExtenso(1_000_000_000)).toBe("um bilhão");
				expect(Format.ptBr.valorPorExtenso(2_000_000_000)).toBe("dois bilhões");

				expect(Format.ptBr.valorPorExtenso(1_000_000_000_000)).toBe("um trilhão");
				expect(Format.ptBr.valorPorExtenso(2_000_000_000_000)).toBe("dois trilhões");

				expect(Format.ptBr.valorPorExtenso(1_000_000_000_000_000)).toBe("um quatrilhão");
				expect(Format.ptBr.valorPorExtenso(2_000_000_000_000_000)).toBe("dois quatrilhões");
			});

			test("should convert value to words correctly", () => {
				expect(Format.ptBr.valorPorExtenso(0)).toBe("zero");
				expect(Format.ptBr.valorPorExtenso(1)).toBe("um");
				expect(Format.ptBr.valorPorExtenso(13)).toBe("treze");
				expect(Format.ptBr.valorPorExtenso(23)).toBe("vinte e três");
				expect(Format.ptBr.valorPorExtenso(123)).toBe("cento e vinte e três");
				expect(Format.ptBr.valorPorExtenso(1123)).toBe("mil cento e vinte e três");

				expect(Format.ptBr.valorPorExtenso(1_000)).toBe("mil");
				expect(Format.ptBr.valorPorExtenso(1_001)).toBe("mil e um");
				expect(Format.ptBr.valorPorExtenso(1_234)).toBe("mil duzentos e trinta e quatro");
				expect(Format.ptBr.valorPorExtenso(2_001)).toBe("dois mil e um");
				expect(Format.ptBr.valorPorExtenso(1_010)).toBe("mil e dez");
				expect(Format.ptBr.valorPorExtenso(1_100)).toBe("mil e cem");
				expect(Format.ptBr.valorPorExtenso(100_000)).toBe("cem mil");
				expect(Format.ptBr.valorPorExtenso(100_001)).toBe("cem mil e um");
				expect(Format.ptBr.valorPorExtenso(101_000)).toBe("cento e um mil");
				expect(Format.ptBr.valorPorExtenso(102_000)).toBe("cento e dois mil");
				expect(Format.ptBr.valorPorExtenso(1_000_000)).toBe("um milhão");
				expect(Format.ptBr.valorPorExtenso(2_000_000)).toBe("dois milhões");
				expect(Format.ptBr.valorPorExtenso(1_101_000)).toBe("um milhão cento e um mil");
				expect(Format.ptBr.valorPorExtenso(1_100_000)).toBe("um milhão e cem mil");
				expect(Format.ptBr.valorPorExtenso(1_234_567)).toBe("um milhão duzentos e trinta e quatro mil quinhentos e sessenta e sete");
				expect(Format.ptBr.valorPorExtenso(1_000_001)).toBe("um milhão e um");
				expect(Format.ptBr.valorPorExtenso(1_234_567_890_123_456)).toBe(
					"um quatrilhão duzentos e trinta e quatro trilhões quinhentos e sessenta e sete bilhões oitocentos e noventa milhões cento e vinte e três mil quatrocentos e cinquenta e seis"
				);
				expect(Format.ptBr.valorPorExtenso(2_234_567_890_123_456)).toBe(
					"dois quatrilhões duzentos e trinta e quatro trilhões quinhentos e sessenta e sete bilhões oitocentos e noventa milhões cento e vinte e três mil quatrocentos e cinquenta e seis"
				);
				expect(Format.ptBr.valorPorExtenso(999_999_999_999_999_999n)).toBe(
					"novecentos e noventa e nove quatrilhões novecentos e noventa e nove trilhões novecentos e noventa e nove bilhões novecentos e noventa e nove milhões novecentos e noventa e nove mil novecentos e noventa e nove"
				);
			});

			it("should throw an error for value less than 0 or greater than 999_999_999_999_999_999", () => {
				const expected = "O valor deve estar entre 0 e 999_999_999_999_999_999";
				expect(() => Format.ptBr.valorPorExtenso(-1)).toThrow(expected);
				expect(() => Format.ptBr.valorPorExtenso(1000 ** 6)).toThrowError(expected);
				expect(() => Format.ptBr.valorPorExtenso(1_000_000_000_000_000_000n)).toThrow(expected);
			});
		});
	});

	describe("date", () => {
		it("should format a Date object into a string", () => {
			const date = new Date("2022-01-01T12:34:56.789Z");
			const format = "yyyy-MM-dd HH:mm:ss.SSS";
			const locale = "en-US";

			const result = Format.date(date, format, { locale, timeZoneUTC: true });

			expect(result).toBe("2022-01-01 12:34:56.789");
		});

		it("should handle a string input and return a formatted string", () => {
			const dateStr = "2022-01-01T12:34:56.789Z";
			const format = "yyyy-MM-dd HH:mm:ss.SSS";
			const locale = "en-US";

			const result = Format.date(dateStr, format, { locale });

			expect(result).toBe("2022-01-01 12:34:56.789");
		});

		it("should handle a number input and return a formatted string", () => {
			const dateNum = Date.parse("2022-01-01T12:34:56.789Z");
			const format = "yyyy-MM-dd HH:mm:ss.SSS";
			const locale = "en-US";

			const result = Format.date(dateNum, format, { locale });

			expect(result).toBe("2022-01-01 12:34:56.789");
		});

		it("should handle a non-standard format and return a formatted string", () => {
			const date = new Date("2024-01-01T12:34:56.789Z");
			const format = "dddd, dd MMMM yyyy";
			const locale = "en-US";

			const result = Format.date(date, format, { locale });

			expect(result).toBe("Monday, 01 January 2024");
		});

		it("should handle an invalid input and throw an error", () => {
			const date = "invalid-date";
			const format = "yyyy-MM-dd HH:mm:ss.SSS";
			const locale = "en-US";

			expect(() => Format.date(date, format, { locale })).toThrow("Invalid date provided");
		});
	});

	describe("currency", () => {
		it("should format a number as currency with default options", () => {
			expect(Format.currency(123456.78)).toBe("R$ 123.456,78");
		});

		it("should format a number as currency with custom options", () => {
			expect(Format.currency(1234.56, { locale: "en", currency: "USD" })).toBe("$1,234.56");
		});

		it("should handle large numbers", () => {
			expect(Format.currency(1234567890.123)).toBe("R$ 1.234.567.890,12");
			expect(Format.currency(1234567890123.456)).toBe("R$ 1.234.567.890.123,46");
		});

		it("should handle zero value", () => {
			expect(Format.currency(0)).toBe("R$ 0,00");
		});

		it("should handle negative value", () => {
			expect(Format.currency(-123456.78)).toBe("-R$ 123.456,78");
		});
	});

	describe("number", () => {
		it("formats a number with default locale", () => {
			expect(Format.number(123456.78)).toBe("123.456,78");
		});

		it("formats a number with a specific locale", () => {
			expect(Format.number(1234.56, "en-US")).toBe("1,234.56");
		});

		it("should handle large numbers", () => {
			expect(Format.number(1234567890.123)).toBe("1.234.567.890,123");
			expect(Format.number(1234567890123.456)).toBe("1.234.567.890.123,456");
		});

		it("returns an empty string if the value is not a number", () => {
			expect(() => Format.number("not a number" as unknown as number)).toThrow("Value must be a number");
		});

		it("returns an empty string if the value is 0", () => {
			expect(Format.number(0, "en")).toBe("0.00");
		});
	});

	describe("abbreviateNumber", () => {
		it("should abbreviate numbers with different magnitudes", () => {
			expect(Format.abbreviateNumber(1)).toBe("1");
			expect(Format.abbreviateNumber(1_234)).toBe("1.23K");
			expect(Format.abbreviateNumber(1_234_567)).toBe("1.23M");
			expect(Format.abbreviateNumber(1_234_567_890)).toBe("1.23B");
			expect(Format.abbreviateNumber(1_234_567_890_123)).toBe("1.23T");
			expect(Format.abbreviateNumber(1_234_567_890_123_456)).toBe("1.23Q");
			expect(Format.abbreviateNumber(1_234_567_890_123_456_789n)).toBe("1.23Qi");
			expect(Format.abbreviateNumber(1_234_567_890_123_456_789_012n)).toBe("1.23S");
			expect(Format.abbreviateNumber(1_234_567_890_123_456_789_012_345n)).toBe("1.23Se");
			expect(Format.abbreviateNumber(1_234_567_890_123_456_789_012_345_678n)).toBe("1.23O");
			expect(Format.abbreviateNumber(1_234_567_890_123_456_789_012_345_678_901n)).toBe("1.23N");
			expect(Format.abbreviateNumber(1_234_567_890_123_456_789_012_345_678_901_234n)).toBe("1.23D");
		});

		it("should handle decimal numbers", () => {
			expect(Format.abbreviateNumber(1234.56)).toBe("1.23K");
		});

		it("should handle large numbers", () => {
			expect(Format.abbreviateNumber(1_234_567_890.123)).toBe("1.23B");
			expect(Format.abbreviateNumber(1_234_567_890_123.456)).toBe("1.23T");
			expect(Format.abbreviateNumber(1e33)).toBe("1D");
			expect(Format.abbreviateNumber(1e33, { fractionDigits: 1, removeEndZero: false })).toBe("1.0D");
			expect(Format.abbreviateNumber(1e33, { removeEndZero: false })).toBe("1.00D");
		});

		it("should return the original number as a string if no abbreviation is applicable", () => {
			expect(Format.abbreviateNumber(500)).toBe("500");
			expect(Format.abbreviateNumber(0)).toBe("0");
			expect(Format.abbreviateNumber(1)).toBe("1");
		});

		it("should handle different options", () => {
			expect(Format.abbreviateNumber(1500, { fractionDigits: 1 })).toBe("1.5K");
			expect(Format.abbreviateNumber(2000000, { fractionDigits: 1 })).toBe("2M");
			expect(Format.abbreviateNumber(123456789, { removeEndZero: false })).toBe("123.46M");
		});
	});

	describe("onlyNumbers", () => {
		it("should remove all non-numeric characters from a string", () => {
			expect(Format.onlyNumbers("123abc")).toBe("123");
			expect(Format.onlyNumbers("!@#123$%^456&*()")).toBe("123456");
			expect(Format.onlyNumbers("12 34 56")).toBe("123456");
			expect(Format.onlyNumbers("abc")).toBe("");
			expect(Format.onlyNumbers(null as unknown as string)).toBeUndefined();
			expect(Format.onlyNumbers(undefined as unknown as string)).toBeUndefined();
		});
	});

	describe("padZerosByRef", () => {
		it("should pad the number with leading zeros to match the number of digits in the reference value", () => {
			expect(Format.padZerosByRef(2, 90)).toBe("02");
			expect(Format.padZerosByRef(12, 110)).toBe("012");
			expect(Format.padZerosByRef(123, 1000)).toBe("0123");
			expect(Format.padZerosByRef(1234, 10_000)).toBe("01234");
		});

		it("should handle reference values with fewer digits than the input number", () => {
			expect(Format.padZerosByRef(2, 1)).toBe("2");
			expect(Format.padZerosByRef(12, 2)).toBe("12");
			expect(Format.padZerosByRef(123, 3)).toBe("123");
		});

		it("should handle edge cases", () => {
			expect(Format.padZerosByRef(0, 1)).toBe("0");
			expect(Format.padZerosByRef(0, 11)).toBe("00");
			expect(Format.padZerosByRef(0, 222)).toBe("000");
			expect(Format.padZerosByRef(2, 999)).toBe("002");
			expect(Format.padZerosByRef(1, 1_000)).toBe("0001");
		});
	});

	describe("date", () => {
		it("should format date with default format", () => {
			const date = "2025-03-01 17:33:44.135";

			expect(Format.date(date, "yy yyyy")).toBe("25 2025");
			expect(Format.date(date, "M|MM|MMM|MMMM", { locale: "pt-BR" }).toLocaleLowerCase()).toBe("3|03|mar|março");
			expect(Format.date(date, "d dd ddd. dddd", { locale: "pt-BR" }).toLocaleLowerCase()).toBe("1 01 sáb. sábado");
			expect(Format.date(date, "hh HH")).toBe("05 17");
			expect(Format.date(date, "mm")).toBe("33");
			expect(Format.date(date, "ss")).toBe("44");
			expect(Format.date(date, "SSS")).toBe("135");
			expect(Format.date(date, "a A")).toBe("pm PM");
			expect(Format.date("2025/03/03 07:33", "a A")).toBe("am AM");
			expect(Format.date(date, "HH:mm:ss.SSS")).toBe("17:33:44.135");
			expect(Format.titleCase(Format.date(date, "dddd, dd MMMM yyyy", { locale: "pt-BR" }))).toBe("Sábado, 01 Março 2025");
		});

		it("should format date with default format", () => {
			const date = new Date(2024, 7, 1);
			const formattedDate = Format.date(date, "dd/MM/yyyy");
			expect(formattedDate).toBe("01/08/2024");
		});

		it("should format date with custom format", () => {
			const date = new Date(2024, 7, 1);
			const formattedDate = Format.date(date, "HH:mm:ss");
			expect(formattedDate).toBe("00:00:00"); //return timezone local time
		});

		it("should format date with locale", () => {
			const date = new Date(2025, 2, 2);
			const formattedDate = Format.titleCase(Format.date(date, "dddd, dd MMMM yyyy", { locale: "en-US" }));
			expect(formattedDate).toBe("Sunday, 02 March 2025");
		});

		it("should handle invalid date", () => {
			const date = " invalid date ";
			expect(() => Format.date(date, "dd/MM/yyyy")).toThrowError();
		});

		it("should format date with am/pm", () => {
			const date = new Date(2024, 7, 1, 15);
			const formattedDate = Format.date(date, "hh:mm a");
			expect(formattedDate).toBe("03:00 pm");
		});

		it("should format date with AM/PM", () => {
			const date = new Date(2024, 7, 1, 15);
			const formattedDate = Format.date(date, "hh:mm A");
			expect(formattedDate).toBe("03:00 PM");
		});

		it("should format date with two-digit hours", () => {
			const date = new Date(2024, 7, 1, 15);
			const formattedDate = Format.date(date, "HH:mm");
			expect(formattedDate).toBe("15:00");
		});

		it("should format date with two-digit minutes", () => {
			const date = new Date(2024, 7, 1, 15, 30);
			const formattedDate = Format.date(date, "HH:mm");
			expect(formattedDate).toBe("15:30");
		});

		it("should format date with two-digit seconds", () => {
			const date = new Date(2024, 7, 1, 15, 30, 45);
			const formattedDate = Format.date(date, "HH:mm:ss");
			expect(formattedDate).toBe("15:30:45");
		});

		it("should format date with four-digit year", () => {
			const date = new Date(2024, 7, 1);
			const formattedDate = Format.date(date, "yyyy");
			expect(formattedDate).toBe("2024");
		});

		it("should format date with two-digit year", () => {
			const date = new Date(2024, 7, 1);
			const formattedDate = Format.date(date, "yy");
			expect(formattedDate).toBe("24");
		});

		it("should format date with full month name", () => {
			const date = new Date(2024, 7, 1);
			const formattedDate = Format.date(date, "MMMM", { locale: "en-US" });
			expect(formattedDate).toBe("August");
		});

		it("should format date with abbreviated month name", () => {
			const date = new Date(2024, 7, 1);
			const formattedDate = Format.date(date, "MMM", { locale: "en-US" });
			expect(formattedDate).toBe("Aug");
		});

		it("should format date with two-digit month", () => {
			const date = new Date(2024, 7, 1);
			const formattedDate = Format.date(date, "MM");
			expect(formattedDate).toBe("08");
		});

		it("should format date with full weekday nam, locale en-US", () => {
			const date = new Date(2024, 7, 1);
			const formattedDate = Format.date(date, "dddd", { locale: "en-US" });
			expect(formattedDate).toBe("Thursday");
		});

		it("should format date with full weekday nam, locale pt-BR", () => {
			const date = new Date(2024, 7, 1);
			const formattedDate = Format.date(date, "dddd", { locale: "pt-BR" }).toLocaleLowerCase();
			expect(formattedDate).toBe("quinta-feira");
		});

		it("should format date with abbreviated weekday name", () => {
			const date = new Date(2025, 2, 2);
			const formattedDate = Format.date(date, "ddd", { locale: "pt-BR" }).toLocaleLowerCase();
			expect(formattedDate).toBe("dom");
		});

		it("should format date with two-digit day", () => {
			const date = new Date("2024-08-01T12:00:00.000Z");
			const formattedDate = Format.date(date, "dd");
			expect(formattedDate).toBe("01");
		});

		it("should handle date with timezone offset", () => {
			const date = new Date("2024-08-01 20:00:00.000");
			const formattedDate = Format.date(date, "hh:mm:ss");
			expect(formattedDate).toBe("08:00:00");
		});

		it("should handle string with timezone offset", () => {
			const date = "2025-03-03 17:33:44.135";
			const formattedDate = Format.date(date, "h:mm:ss a");
			expect(formattedDate).toBe("5:33:44 pm");
		});

		it("should handle string withless timezone offset", () => {
			const date = "2025-03-03 17:33:44.135Z";
			const formattedDate = Format.date(date, "h:mm:ss a");
			expect(formattedDate).toBe("5:33:44 pm");
		});

		it("should handle date with timezone offset", () => {
			const date = new Date("2025-03-03 17:33:44.135");
			const formattedDate = Format.date(date, "hh:mm:ss A");
			expect(formattedDate).toBe("05:33:44 PM");
		});

		it("should handle date withless timezone offset", () => {
			const date = new Date("2025-03-03 17:33:44.135Z");
			const formattedDate = Format.date(date, "hh:mm:ss A", { timeZoneUTC: true });
			expect(formattedDate).toBe("05:33:44 PM");
		});

		it("should handle date with milliseconds", () => {
			const formattedDate = Format.date("2024-07-01 12:00:00.123", "HH:mm:ss.SSS");
			expect(formattedDate).toBe("12:00:00.123");
		});
	});

	describe("abbreviateNumber", () => {
		it("abbreviates numbers with different magnitudes", () => {
			expect(Format.abbreviateNumber(1500)).toBe("1.5K");
			expect(Format.abbreviateNumber(2000000)).toBe("2M");
			expect(Format.abbreviateNumber(123456789)).toBe("123.46M");
			expect(Format.abbreviateNumber(123456789, { fractionDigits: 1 })).toBe("123.5M");
			expect(Format.abbreviateNumber(1e33, { removeEndZero: false })).toBe("1.00D");
		});

		it("abbreviates numbers with different fraction digits", () => {
			expect(Format.abbreviateNumber(1005, { fractionDigits: 1 })).toBe("1K");
			expect(Format.abbreviateNumber(2_449_100, { fractionDigits: 2 })).toBe("2.45M");
			expect(Format.abbreviateNumber(2_459_010, { fractionDigits: 3 })).toBe("2.459M");
		});

		it("abbreviates numbers with and without removing trailing zeros", () => {
			expect(Format.abbreviateNumber(1500, { fractionDigits: 2, removeEndZero: true })).toBe("1.5K");
			expect(Format.abbreviateNumber(1500, { fractionDigits: 2, removeEndZero: false })).toBe("1.50K");
		});

		it("returns original number as string if no abbreviation is applicable", () => {
			expect(Format.abbreviateNumber(500)).toBe("500");
		});

		it("handles decimal numbers", () => {
			expect(Format.abbreviateNumber(1234.56)).toBe("1.23K");
		});
	});

	describe("titleCase", () => {
		it("should return empty string for empty input", () => {
			expect(Format.titleCase("")).toBe("");
		});

		it("should capitalize single word input", () => {
			expect(Format.titleCase("john")).toBe("John");
		});

		it("should capitalize multiple words input with no conjunctions", () => {
			expect(Format.titleCase("john smith")).toBe("John Smith");
		});

		it("should maintain lowercase conjunctions in multiple words input", () => {
			expect(Format.titleCase("john doe de souza")).toBe("John Doe de Souza");
			expect(Format.titleCase("maria da silva")).toBe("Maria da Silva");
		});

		it("should ignore leading/trailing whitespace", () => {
			expect(Format.titleCase("  john smith  ")).toBe("John Smith");
		});

		it("should handle multiple consecutive whitespace characters", () => {
			expect(Format.titleCase("john   smith")).toBe("John Smith");
		});
	});

	describe("slugify", () => {
		it("should slugify a string with no special characters", () => {
			expect(Format.slugify("hello world")).toBe("hello-world");
		});

		it("should slugify a string with special characters", () => {
			expect(Format.slugify("Hello, world!")).toBe("hello-world");
		});

		it("should slugify a string with multiple spaces", () => {
			expect(Format.slugify("Hello   world")).toBe("hello-world");
		});

		it("should slugify a string with leading and trailing spaces", () => {
			expect(Format.slugify("   Hello world   ")).toBe("hello-world");
		});

		it("should slugify a string with leading and trailing special characters", () => {
			expect(Format.slugify("!@#$Hello world$%^^")).toBe("hello-world");
		});
	});

	describe("maskIt", () => {
		it("masks a substring with default mask character", () => {
			expect(Format.maskIt("1234567890", "*", 2, 5)).toBe("12***67890");
		});

		it("masks a substring with custom mask character", () => {
			expect(Format.maskIt("1234567890", "#", 3)).toBe("123#######");
		});

		it("masks until the end of the string", () => {
			expect(Format.maskIt("1234567890", "$", 3)).toBe("123$$$$$$$");
		});

		it("throws an error with invalid start index", () => {
			expect(() => Format.maskIt("1234567890", "*", -1)).toThrowError("Invalid start or final index");
		});

		it("throws an error with invalid final index", () => {
			expect(() => Format.maskIt("1234567890", "*", 10, 1)).toThrowError("Invalid start or final index");
		});

		it("throws an error with invalid mask character", () => {
			expect(() => Format.maskIt("1234567890", "**", 2, 5)).toThrowError("maskChar must be a single character");
		});

		it("masks an empty string", () => {
			expect(Format.maskIt("", "*", 0, 0)).toBe("");
		});

		it("masks a string with no characters to mask", () => {
			expect(Format.maskIt("1234567890", "*", 10, 10)).toBe("1234567890");
		});
	});

	describe("maskItParts", () => {
		it("should mask a string with default mask character and visible characters", () => {
			expect(Format.maskItParts("Heliomar P. Marques", "*", 2)).toBe("He****** P. Ma*****");
		});

		it("should set visible characters to 1 for negative input", () => {
			expect(Format.maskItParts("Heliomar P. Marques", "*", 0)).toBe("H******* P. M******");
		});

		it("should throw an error for invalid mask character", () => {
			expect(() => Format.maskItParts("Heliomar P. Marques", "**")).toThrowError("maskChar must be a single character");
		});

		it("should mask a string with custom mask character and visible characters", () => {
			expect(Format.maskItParts("+55 (11) 91888-0000", "#", 1)).toBe("+5# (1#) 9####-0###");
		});

		it("should mask a string with custom mask character and visible characters", () => {
			expect(Format.maskItParts("123.444.555-67", "_", 2)).toBe("12_.44_.55_-67");
		});

		it("should not mask a short string", () => {
			expect(Format.maskItParts("abc")).toBe("a**");
		});

		it("should return an empty string for an empty input", () => {
			expect(Format.maskItParts("")).toBe("");
		});
	});

	describe("truncate", () => {
		it("truncates a text that is longer than the maximum length", () => {
			const text = "Hello, world!";
			const maxLength = 5;
			const expected = "He...";
			expect(Format.truncate(text, maxLength)).toBe(expected);
		});

		it("truncates a text that is equal to the maximum length", () => {
			const text = "Hello";
			const maxLength = 5;
			const expected = "Hello";
			expect(Format.truncate(text, maxLength)).toBe(expected);
		});

		it("truncates a text that is shorter than the maximum length", () => {
			const text = "Short text";
			const maxLength = 20;
			const expected = "Short text";
			expect(Format.truncate(text, maxLength)).toBe(expected);
		});

		it("uses a custom ellipsis string", () => {
			const text = "Hello, world!";
			const maxLength = 5;
			const ellipsis = "...!";
			const expected = "H...!";
			expect(Format.truncate(text, maxLength, ellipsis)).toBe(expected);
		});

		it("throws an error if maxLength is less than or equal to the ellipsis length", () => {
			const text = "Hello, world!";
			const maxLength = 2;
			expect(() => Format.truncate(text, maxLength)).toThrowError("maxLength must be greater than ellipsis length");
		});
	});

	describe("interpolate", () => {
		it("interpolates a template string with a single variable", () => {
			const template = "Hello, {0}!";
			const variable = "World";
			expect(Format.interpolate(template, variable)).toBe("Hello, World!");
		});

		it("interpolates a template string with multiple variables", () => {
			const template = "The sum of ({0} + {0}) is {1}.";
			const variables = [2, 4];
			expect(Format.interpolate(template, ...variables)).toBe("The sum of (2 + 2) is 4.");
		});

		it("returns the original template if no variables are provided", () => {
			const template = "Hello, {0}!";
			expect(Format.interpolate(template)).toBe("Hello, {0}!");
		});

		it("returns an empty string if the template is empty", () => {
			expect(Format.interpolate("")).toBe("");
		});

		it("throws an error if the index is out of range", () => {
			const template = "Hello, {1}!";
			const variable = "World";
			expect(() => Format.interpolate(template, variable)).toThrowError("Placeholder index out of range");
		});

		it("throws an error if an index is missing", () => {
			const template = "Hello, {0}! {1}";
			const variable = "World";
			expect(() => Format.interpolate(template, variable)).toThrowError("Placeholder index out of range");
		});

		it("throws an error if no placeholders are found in the template", () => {
			const template = "Hello, {a}!";
			const variable = "World";

			expect(() => Format.interpolate(template, variable)).toThrowError("No placeholders found in template");
		});
	});
});

export type FinancialTerm = {
  term: string
  definition: string
  example: string
}

export const financialTerms: FinancialTerm[] = [
  {
    term: "Asset",
    definition: "Anything valuable that you own or can use to make money.",
    example: "Your laptop, car, or even a small investment portfolio counts as an asset!"
  },
  {
    term: "Liability",
    definition: "Something you owe or a financial obligation.",
    example: "A student loan or credit card debt is a liability until it’s paid off."
  },
  {
    term: "Equity",
    definition: "The value of ownership you have after subtracting what you owe.",
    example: "If your car is worth $10,000 and you still owe $3,000 on it, your equity is $7,000."
  },
  {
    term: "Diversification",
    definition: "Spreading your money across different investments to lower risk.",
    example: "Investing in stocks, crypto, and bonds instead of putting all your cash in one thing."
  },
  {
    term: "TFSA",
    definition: "Tax-Free Savings Account - A savings account where your money grows without being taxed. Think of it like a magical piggy bank where the government doesn't take a cut.",
    example: "Save $500/month, and after a year you have $6,000 + interest, all tax-free!"
  },
  {
    term: "FHSA",
    definition: "First Home Savings Account - A special account to help you save for your first home. It combines the best parts of a TFSA and RRSP.",
    example: "Save up to $8,000/year and get it back on your taxes while saving for that condo!"
  },
  {
    term: "Compound Interest",
    definition: "Interest on your interest - Your money makes money, and then that money makes more money. It's like a snowball rolling downhill getting bigger.",
    example: "Save $100 at 5% interest. Year 1: $105. Year 2: $110.25 (you earned interest on the $5 too!)"
  },
  {
    term: "MER",
    definition: "Management Expense Ratio - The yearly fee for managing your investment, shown as a percentage. Lower is better!",
    example: "A 2% MER means you pay $20/year for every $1,000 invested. Look for MERs under 1%."
  },
  {
    term: "Net Worth",
    definition: "Everything you own minus everything you owe. It's your financial score - not your self worth!",
    example: "If you have $5,000 saved but owe $2,000 in student loans, your net worth is $3,000."
  },
  {
    term: "Budget",
    definition: "Your money plan - deciding where your cash goes before it disappears. Not a restriction, but a permission slip to spend guilt-free.",
    example: "Income $1,500 → Rent $600 + Food $300 + Fun $200 + Savings $400 = Balanced!"
  },
  {
    term: "Emergency Fund",
    definition: "Cash saved for 'oh crap' moments - unexpected expenses like car repairs or losing your job. Aim for 3-6 months of expenses.",
    example: "If you spend $1,500/month, save $4,500-$9,000 for peace of mind."
  },
  {
    term: "Index Fund",
    definition: "A lazy (but smart) way to invest - you buy a tiny piece of hundreds of companies at once instead of picking individual stocks.",
    example: "Instead of guessing if Apple or Google will win, buy both (and 498 other companies) in one purchase!"
  }
]
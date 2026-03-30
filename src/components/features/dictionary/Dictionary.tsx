import { useState } from "react"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { financialTerms } from "./dictionaryData"
import { BookOpenIcon } from "lucide-react"

export default function Dictionary() {
	const [activeTerm, setActiveTerm] = useState<string | null>(null)
	const handleClick = (term: string) => {
	setActiveTerm(term === activeTerm ? null : term)
	}

	return (
		<div  id="dictionary" className="mx-8 mt-8 pb-12 scroll-mt-20">
			<Card className="rounded-xl">
				<CardHeader>
					<CardTitle className="text-xl font-bold flex items-center gap-2">
					<BookOpenIcon className="h-5 w-5 text-green-600" />
					Financial Dictionary
					</CardTitle>
					<p className="text-sm text-gray-600 mt-1">
						Finance doesn't have to be confusing. Tap to learn what these terms actually mean:
					</p>
				</CardHeader>

				<CardContent>
					<Accordion type="single" collapsible className="w-full">
						{financialTerms.map((item) => (
							<AccordionItem
							key={item.term}
							value={item.term}
							className={`rounded-md border p-4 mb-2 cursor-pointer transition-colors duration-200 ${
								activeTerm === item.term ? "bg-green-50 border-green-300" : "bg-white"
							}`}
							>
								<AccordionTrigger
									onClick={() => handleClick(item.term)}
									className="text-base font-semibold"
								>
									{item.term}
								</AccordionTrigger>

								<AccordionContent className="text-sm text-gray-700 mt-2">
									<p>{item.definition}</p>
									<div
									className="mt-2 p-2 border bg-white rounded-md text-gray-700"
									onClick={(e) => e.stopPropagation()}
									>
									<span className="text-green-600 font-semibold">Example:</span> {item.example}
									</div>
								</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
				</CardContent>
			</Card>
		</div>
	)
}
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export async function exportElementToPdf(element: HTMLElement, fileName = 'resume.pdf') {
  // Render the resume preview to a high-resolution canvas
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#ffffff',
  })

  const imgData = canvas.toDataURL('image/png')
  const pdf = new jsPDF('p', 'pt', 'a4')
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()

  const imgWidth = pageWidth
  const imgHeight = (canvas.height * imgWidth) / canvas.width

  // Scale to fit a single A4 page; most strategic resumes are one page
  const yOffset = Math.max(0, (pageHeight - imgHeight) / 2)
  pdf.addImage(imgData, 'PNG', 0, yOffset, imgWidth, imgHeight)

  pdf.save(fileName)
}


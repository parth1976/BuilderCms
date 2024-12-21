import React, { useRef } from 'react'
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Button } from 'antd';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { notify } from '../../utils/localServiceUtil';

function DownloadInvoice({ emiData , partyData }) {    
    const selectedCompany = useSelector((state) => state.files.selectedCompanyData)

    const pdfRef = useRef(); // Reference to the HTML element

    const handleDownload = async () => {
        const element = pdfRef.current;
        if (element) {
            // Store the original overflow and height
            const originalOverflow = element.style.overflow;
            const originalHeight = element.style.height;
            const originalStyle = element.style.visibility;
            element.style.visibility = "visible";
            element.style.overflow = "visible";
            element.style.height = "auto";

            const canvas = await html2canvas(element, {
                scale: 2, // Increase scale to improve quality
                useCORS: true, // Enable cross-origin resource sharing
            });

            // Restore the original overflow and height
            element.style.overflow = originalOverflow;
            element.style.height = originalHeight;

            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4"); // 'p' for portrait, 'mm' for millimeters, 'a4' for A4 size

            // Calculate the PDF height and width to match the aspect ratio of the element
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            // Add the image to the PDF
            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
            pdf.save("download.pdf");
        } else {
            notify("error", "Failed to generate PDF. Please try again.");
        }
        element.style.visibility = "hidden";
    };

    const downloadPdf = async () => {
        const element = pdfRef.current;

        // Temporarily make the hidden content visible
        const originalStyle = element.style.visibility;
        element.style.visibility = "visible";

        // Temporarily reduce the font size
        const originalFontSize = element.style.fontSize;
        element.style.fontSize = "10px"; // Set a smaller font size

        try {
            // Capture the HTML element as a canvas
            const canvas = await html2canvas(element);
            const imgData = canvas.toDataURL("image/png");

            // Generate the PDF
            const pdf = new jsPDF("p", "mm", "a4");
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            // Calculate the scale to fit content in the PDF page
            const scale = Math.min(pdfWidth / canvas.width, pdfHeight / canvas.height);

            // Adjust the width and height based on scale
            const scaledWidth = canvas.width * scale;
            const scaledHeight = canvas.height * scale;

            // Add the image with the scaled dimensions
            pdf.addImage(imgData, "PNG", 0, 0, scaledWidth, scaledHeight);
            pdf.save("download.pdf");
        } catch (error) {
            console.error("Error generating PDF:", error);
        } finally {
            // Restore the original styles (visibility and font size)
            element.style.visibility = originalStyle;
            element.style.fontSize = originalFontSize;
        }
    };

    return (
        <div>
            <div ref={pdfRef}
                style={{
                    visibility: 'hidden', // Keep it hidden from the user
                    position: 'absolute', // Remove it from the layout
                    height: `calc(100vh - ${50}px)`,
                    overflowY: "auto",
                    top: 0,
                    left: 0
                }}
            >
                <div style={{ margin: '0px', padding: '0px' }}>
                    <table
                        role="presentation"
                        style={{
                            backgroundColor: '#F8F8FC',
                            width: '1200px',
                            maxWidth: '1200px',
                            borderCollapse: 'separate',
                            borderSpacing: '0',
                            textAlign: 'left',
                            margin: '20px auto',
                            border: 'none',
                            padding: '20px',
                            borderRadius: '10px',
                        }}
                    >
                        <tbody>
                            <tr>
                                <td>
                                    <table style={{ width: '100%', padding: '0px', backgroundColor: '#E2EAFF' }}>
                                        <tbody>
                                            <tr>
                                                <td style={{ width: '50%', textAlign: 'left', padding: '10px' }}>
                                                    <h4
                                                        style={{ fontSize: '16px', fontWeight: 600, color: '#1c1f27', margin: '0px' }}
                                                    >
                                                        {selectedCompany?.name}
                                                    </h4>
                                                </td>
                                                <td style={{ width: '50%', textAlign: 'right', padding: '10px' }}>
                                                    <h4
                                                        style={{ fontSize: '16px', fontWeight: 600, color: '#1c1f27', margin: '0px' }}
                                                    >
                                                        {partyData?.houseNumber}
                                                    </h4>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    <table
                                        style={{
                                            width: '100%',
                                            padding: '0px 0px',
                                            backgroundColor: '#fff',
                                            borderRadius: '8px',
                                            marginTop: '0px',
                                            marginBottom: '0px',
                                            borderCollapse: 'collapse',
                                            overflow: 'hidden',
                                            boxShadow: '2px 4px 8px rgba(0, 0, 0, 0.05)',
                                        }}
                                    >
                                        <tbody>
                                            <tr>
                                                <td style={{ padding: '0' }}>
                                                    <table style={{ width: '100%', padding: '20px', borderCollapse: 'separate' }}>
                                                        <tbody>
                                                            <tr>
                                                                <td>
                                                                    <table
                                                                        style={{
                                                                            width: '100%',
                                                                            borderCollapse: 'collapse',
                                                                            border: '2px solid #AABCF5',
                                                                            marginBottom: '0px',
                                                                        }}
                                                                    >
                                                                        <tbody>
                                                                            <tr>
                                                                                <td
                                                                                    style={{
                                                                                        fontSize: '14px',
                                                                                        color: '#1C1F27',
                                                                                        textAlign: 'left',
                                                                                        fontWeight: 600,
                                                                                        padding: '10px',
                                                                                        border: '2px solid #AABCF5',
                                                                                    }}
                                                                                >
                                                                                    FLEAT NO.:
                                                                                </td>
                                                                                <td
                                                                                    style={{
                                                                                        fontSize: '14px',
                                                                                        color: '#1C1F27',
                                                                                        textAlign: 'left',
                                                                                        fontWeight: 500,
                                                                                        padding: '10px',
                                                                                        border: '2px solid #AABCF5',
                                                                                    }}
                                                                                >
                                                                                    {partyData?.houseNumber}
                                                                                </td>
                                                                                <td
                                                                                    style={{
                                                                                        fontSize: '14px',
                                                                                        color: '#1C1F27',
                                                                                        textAlign: 'left',
                                                                                        fontWeight: 600,
                                                                                        padding: '10px',
                                                                                        border: '2px solid #AABCF5',
                                                                                    }}
                                                                                >
                                                                                    VILLAGE:
                                                                                </td>
                                                                                <td
                                                                                    style={{
                                                                                        fontSize: '14px',
                                                                                        color: '#1C1F27',
                                                                                        textAlign: 'left',
                                                                                        fontWeight: 500,
                                                                                        padding: '10px',
                                                                                        border: '2px solid #AABCF5',
                                                                                    }}
                                                                                >
                                                                                    {partyData.village}
                                                                                </td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td
                                                                                    style={{
                                                                                        fontSize: '14px',
                                                                                        color: '#1C1F27',
                                                                                        textAlign: 'left',
                                                                                        fontWeight: 600,
                                                                                        padding: '10px',
                                                                                        border: '2px solid #AABCF5',
                                                                                    }}
                                                                                >
                                                                                    MOBILE:
                                                                                </td>
                                                                                <td
                                                                                    style={{
                                                                                        fontSize: '14px',
                                                                                        color: '#1C1F27',
                                                                                        textAlign: 'left',
                                                                                        fontWeight: 500,
                                                                                        padding: '10px',
                                                                                        border: '2px solid #AABCF5',
                                                                                    }}
                                                                                >
                                                                                    {partyData?.mobileNumber}
                                                                                </td>
                                                                                <td
                                                                                    style={{
                                                                                        fontSize: '14px',
                                                                                        color: '#1C1F27',
                                                                                        textAlign: 'left',
                                                                                        fontWeight: 600,
                                                                                        padding: '10px',
                                                                                        border: '2px solid #AABCF5',
                                                                                    }}
                                                                                >
                                                                                    TALUKO:
                                                                                </td>
                                                                                <td
                                                                                    style={{
                                                                                        fontSize: '14px',
                                                                                        color: '#1C1F27',
                                                                                        textAlign: 'left',
                                                                                        fontWeight: 500,
                                                                                        padding: '10px',
                                                                                        border: '2px solid #AABCF5',
                                                                                    }}
                                                                                >
                                                                                    {partyData?.district}
                                                                                </td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td
                                                                                    style={{
                                                                                        fontSize: '14px',
                                                                                        color: '#1C1F27',
                                                                                        textAlign: 'left',
                                                                                        fontWeight: 600,
                                                                                        padding: '10px',
                                                                                        border: '2px solid #AABCF5',
                                                                                    }}
                                                                                >
                                                                                    DATE:
                                                                                </td>
                                                                                <td
                                                                                    style={{
                                                                                        fontSize: '14px',
                                                                                        color: '#1C1F27',
                                                                                        textAlign: 'left',
                                                                                        fontWeight: 500,
                                                                                        padding: '10px',
                                                                                        border: '2px solid #AABCF5',
                                                                                    }}
                                                                                >
                                                                                    {moment(partyData?.bookingDate).format('DD.MM.YY')}
                                                                                </td>
                                                                                <td
                                                                                    style={{
                                                                                        fontSize: '14px',
                                                                                        color: '#1C1F27',
                                                                                        textAlign: 'left',
                                                                                        fontWeight: 600,
                                                                                        padding: '10px',
                                                                                        border: '2px solid #AABCF5',
                                                                                    }}
                                                                                >
                                                                                    DIST:
                                                                                </td>
                                                                                <td
                                                                                    style={{
                                                                                        fontSize: '14px',
                                                                                        color: '#1C1F27',
                                                                                        textAlign: 'left',
                                                                                        fontWeight: 500,
                                                                                        padding: '10px',
                                                                                        border: '2px solid #AABCF5',
                                                                                    }}
                                                                                >
                                                                                    {partyData?.city}
                                                                                </td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td
                                                                                    colSpan="2"
                                                                                    style={{
                                                                                        fontSize: '14px',
                                                                                        color: '#1C1F27',
                                                                                        textAlign: 'left',
                                                                                        fontWeight: 600,
                                                                                        padding: '10px',
                                                                                        border: '2px solid #AABCF5',
                                                                                    }}
                                                                                >
                                                                                    SIGN:
                                                                                </td>
                                                                                <td
                                                                                    colSpan="2"
                                                                                    style={{
                                                                                        fontSize: '14px',
                                                                                        color: '#1C1F27',
                                                                                        textAlign: 'left',
                                                                                        fontWeight: 600,
                                                                                        padding: '10px',
                                                                                        border: '2px solid #AABCF5',
                                                                                    }}
                                                                                >
                                                                                    SIGN:
                                                                                </td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td
                                                                                    colSpan="2"
                                                                                    style={{
                                                                                        fontSize: '14px',
                                                                                        color: '#1C1F27',
                                                                                        textAlign: 'left',
                                                                                        fontWeight: 600,
                                                                                        padding: '10px',
                                                                                        border: '2px solid #AABCF5',
                                                                                    }}
                                                                                >
                                                                                    kHARIDDAR NU NAME:
                                                                                    <br />
                                                                                    <span
                                                                                        style={{
                                                                                            marginTop: '5px',
                                                                                            display: 'block',
                                                                                            fontWeight: 500,
                                                                                        }}
                                                                                    >
                                                                                        {partyData?.ownerName}
                                                                                    </span>
                                                                                </td>
                                                                                <td
                                                                                    colSpan="2"
                                                                                    style={{
                                                                                        fontSize: '14px',
                                                                                        color: '#1C1F27',
                                                                                        textAlign: 'left',
                                                                                        fontWeight: 600,
                                                                                        padding: '10px',
                                                                                        border: '2px solid #AABCF5',
                                                                                    }}
                                                                                >
                                                                                    Hastak NU NAME:
                                                                                    <br />
                                                                                    <span
                                                                                        style={{
                                                                                            marginTop: '5px',
                                                                                            display: 'block',
                                                                                            fontWeight: 500,
                                                                                        }}
                                                                                    >
                                                                                        {partyData?.brokerName}
                                                                                    </span>
                                                                                </td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td
                                                                                    colSpan="4"
                                                                                    style={{
                                                                                        fontSize: '14px',
                                                                                        textAlign: 'left',
                                                                                        color: '#1C1F27',
                                                                                        fontWeight: 600,
                                                                                        padding: '10px',
                                                                                        border: '2px solid #AABCF5',
                                                                                    }}
                                                                                >
                                                                                    * Dastawej and GST
                                                                                </td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td
                                                                                    colSpan="4"
                                                                                    style={{
                                                                                        fontSize: '14px',
                                                                                        textAlign: 'left',
                                                                                        color: '#1C1F27',
                                                                                        fontWeight: 600,
                                                                                        padding: '10px',
                                                                                        border: '2px solid #AABCF5',
                                                                                    }}
                                                                                >
                                                                                    * Kharidnar party e tmamam sarto ma ha padi che.
                                                                                </td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td
                                                                                    colSpan="4"
                                                                                    style={{
                                                                                        fontSize: '14px',
                                                                                        textAlign: 'left',
                                                                                        color: '#1C1F27',
                                                                                        fontWeight: 600,
                                                                                        padding: '10px',
                                                                                        border: '2px solid #AABCF5',
                                                                                    }}
                                                                                >
                                                                                    * Kharidnar party e tmamam sarto ma ha padi che.
                                                                                </td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td
                                                                                    colSpan="4"
                                                                                    style={{
                                                                                        fontSize: '14px',
                                                                                        color: '#1C1F27',
                                                                                        textAlign: 'left',
                                                                                        fontWeight: 600,
                                                                                        padding: '10px',
                                                                                        border: '2px solid #AABCF5',
                                                                                    }}
                                                                                >
                                                                                    banne party
                                                                                </td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td
                                                                                    colSpan="4"
                                                                                    style={{
                                                                                        fontSize: '14px',
                                                                                        color: '#1C1F27',
                                                                                        textAlign: 'left',
                                                                                        fontWeight: 600,
                                                                                        padding: '10px',
                                                                                        border: '2px solid #AABCF5',
                                                                                    }}
                                                                                >
                                                                                    Note: {partyData?.condition}
                                                                                </td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td
                                                                                    rowSpan="4"
                                                                                    style={{
                                                                                        fontSize: '14px',
                                                                                        textAlign: 'center',
                                                                                        color: '#1C1F27',
                                                                                        fontWeight: 600,
                                                                                        padding: '10px',
                                                                                        border: '2px solid #AABCF5',
                                                                                        backgroundColor: '#F3F5FE',
                                                                                        width: '15%',
                                                                                    }}
                                                                                >
                                                                                    No.
                                                                                </td>
                                                                                <td
                                                                                    rowSpan="4"
                                                                                    style={{
                                                                                        fontSize: '16px',
                                                                                        textAlign: 'center',
                                                                                        color: '#1C1F27',
                                                                                        fontWeight: 600,
                                                                                        padding: '10px',
                                                                                        border: '2px solid #AABCF5',
                                                                                        backgroundColor: '#F3F5FE',
                                                                                        width: '45%',
                                                                                    }}
                                                                                >
                                                                                    Booking Date To Payment Condition
                                                                                </td>
                                                                                <td
                                                                                    style={{
                                                                                        fontSize: '14px',
                                                                                        textAlign: 'center',
                                                                                        color: '#1C1F27',
                                                                                        fontWeight: 600,
                                                                                        padding: '10px',
                                                                                        border: '2px solid #AABCF5',
                                                                                        backgroundColor: '#F3F5FE',
                                                                                        width: '20.5%',
                                                                                    }}
                                                                                >
                                                                                    Sq.FT
                                                                                </td>
                                                                                <td
                                                                                    style={{
                                                                                        fontSize: '14px',
                                                                                        textAlign: 'center',
                                                                                        color: '#1C1F27',
                                                                                        fontWeight: 600,
                                                                                        padding: '10px',
                                                                                        border: '2px solid #AABCF5',
                                                                                        backgroundColor: '#F3F5FE',
                                                                                        width: '20.5%',
                                                                                    }}
                                                                                >
                                                                                    Rate
                                                                                </td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td
                                                                                    style={{
                                                                                        fontSize: '13px',
                                                                                        textAlign: 'center',
                                                                                        color: '#1C1F27',
                                                                                        fontWeight: 600,
                                                                                        padding: '10px',
                                                                                        border: '2px solid #AABCF5',
                                                                                        textAlign: 'center',
                                                                                    }}
                                                                                >
                                                                                    {partyData?.houseSize}
                                                                                </td>
                                                                                <td
                                                                                    style={{
                                                                                        fontSize: '13px',
                                                                                        textAlign: 'center',
                                                                                        color: '#1C1F27',
                                                                                        fontWeight: 600,
                                                                                        padding: '10px',
                                                                                        border: '2px solid #AABCF5',
                                                                                        textAlign: 'center',
                                                                                    }}
                                                                                >
                                                                                    {partyData?.sqRate}
                                                                                </td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td
                                                                                    colSpan="2"
                                                                                    style={{
                                                                                        fontSize: '13px',
                                                                                        backgroundColor: '#E2EAFF',
                                                                                        textAlign: 'center',
                                                                                        color: '#1C1F27',
                                                                                        fontWeight: 600,
                                                                                        padding: '10px',
                                                                                        border: '2px solid #AABCF5',
                                                                                    }}
                                                                                >
                                                                                    Total Payment
                                                                                </td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td
                                                                                    colSpan="2"
                                                                                    style={{
                                                                                        fontSize: '13px',
                                                                                        backgroundColor: '#E2EAFF',
                                                                                        textAlign: 'center',
                                                                                        color: '#1C1F27',
                                                                                        fontWeight: 700,
                                                                                        padding: '10px',
                                                                                        border: '2px solid #AABCF5',
                                                                                    }}
                                                                                >
                                                                                    {partyData?.payment}
                                                                                </td>
                                                                            </tr>
                                                                            {emiData.map((x, i) => (
                                                                                <tr key={i}>
                                                                                    <td
                                                                                        style={{
                                                                                            fontSize: '13px',
                                                                                            textAlign: 'center',
                                                                                            color: '#1C1F27',
                                                                                            fontWeight: 500,
                                                                                            padding: '10px',
                                                                                            border: '2px solid #AABCF5',
                                                                                        }}
                                                                                    >
                                                                                        {i}
                                                                                    </td>
                                                                                    <td
                                                                                        style={{
                                                                                            fontSize: '13px',
                                                                                            textAlign: 'center',
                                                                                            color: '#1C1F27',
                                                                                            fontWeight: 500,
                                                                                            padding: '10px',
                                                                                            border: '2px solid #AABCF5',
                                                                                        }}
                                                                                    >
                                                                                        {x?.reminderDate}
                                                                                    </td>
                                                                                    <td
                                                                                        colSpan="2"
                                                                                        style={{
                                                                                            fontSize: '13px',
                                                                                            textAlign: 'center',
                                                                                            color: '#1C1F27',
                                                                                            fontWeight: 500,
                                                                                            padding: '10px',
                                                                                            border: '2px solid #AABCF5',
                                                                                        }}
                                                                                    >
                                                                                        {x?.payment}
                                                                                    </td>
                                                                                </tr>
                                                                            ))}
                                                                            {/* Repeat rows omitted for brevity */}
                                                                            <tr>
                                                                                <td colspan="2"
                                                                                    style={{
                                                                                        fontSize: '13px',
                                                                                        textAlign: 'center',
                                                                                        color: '#1C1F27',
                                                                                        fontWeight: 500,
                                                                                        padding: '10px',
                                                                                        border: '2px solid #AABCF5',
                                                                                    }}>
                                                                                    Total Pending Payment</td>
                                                                                <td colspan="2"
                                                                                    style={{
                                                                                        fontSize: '13px',
                                                                                        textAlign: 'center',
                                                                                        color: '#1C1F27',
                                                                                        fontWeight: 500,
                                                                                        padding: '10px',
                                                                                        border: '2px solid #AABCF5',
                                                                                    }}>
                                                                                    {partyData?.remainingAmount}</td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td colspan="2"
                                                                                    style={{
                                                                                        fontSize: '14px',
                                                                                        backgroundColor: '#E2EAFF',
                                                                                        textAlign: 'center',
                                                                                        color: '#1C1F27',
                                                                                        fontWeight: 700,
                                                                                        padding: '10px',
                                                                                        backgroundColor: '#E2EAFF',
                                                                                        border: '2px solid #AABCF5',
                                                                                    }}>
                                                                                    Total Flat Payment</td>
                                                                                <td colspan="2"
                                                                                    style={{
                                                                                        fontSize: '14px',
                                                                                        backgroundColor: '#E2EAFF',
                                                                                        textAlign: 'center',
                                                                                        color: '#1C1F27',
                                                                                        fontWeight: 700,
                                                                                        padding: '10px',
                                                                                        backgroundColor: '#E2EAFF',
                                                                                        border: '2px solid #AABCF5',
                                                                                    }}>
                                                                                    {partyData?.payment}</td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <Button onClick={handleDownload}>Download PDF</Button>
        </div>
    )
}
export default DownloadInvoice
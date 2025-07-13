import React, { useState, useEffect } from 'react';
import './DotNetCoreLearning.css';

const DotNetCoreLearningGuide = () => {
    const [content, setContent] = useState('');

    useEffect(() => {
        fetch('/DotNetCoreLearningGuide.md')
            .then(response => response.text())
            .then(text => setContent(text));
    }, []);

    const parseMarkdown = (markdown) => {
        const lines = markdown.split('\n');
        const sections = [];
        let currentSection = null;
        let currentSubSection = null;

        lines.forEach(line => {
            if (line.startsWith('## ')) {
                if (currentSection) {
                    sections.push(currentSection);
                }
                currentSection = { title: line.substring(3), subsections: [] };
                currentSubSection = null;
            } else if (line.startsWith('### ')) {
                if (currentSubSection) {
                    currentSection.subsections.push(currentSubSection);
                }
                currentSubSection = { title: line.substring(4), items: [] };
            } else if (line.match(/^\d+\./)) {
                if (currentSubSection) {
                    currentSubSection.items.push(line);
                }
            }
        });

        if (currentSubSection) {
            currentSection.subsections.push(currentSubSection);
        }
        if (currentSection) {
            sections.push(currentSection);
        }

        return sections;
    };

    const sections = parseMarkdown(content);

    return (
        <div className="learning-guide">
            <h1>Comprehensive .NET Core Learning Guide</h1>
            {sections.map((section, index) => (
                <div key={index} className="section">
                    <h2>{section.title}</h2>
                    {section.subsections.map((subsection, subIndex) => (
                        <div key={subIndex} className="subsection">
                            <h3>{subsection.title}</h3>
                            <ul>
                                {subsection.items.map((item, itemIndex) => (
                                    <li key={itemIndex}>{item.replace(/^\d+\.\s*/, '')}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default DotNetCoreLearningGuide;
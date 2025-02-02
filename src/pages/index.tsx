import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import React, { useState, useEffect } from 'react';

import styles from './index.module.css';
import { translate } from '@docusaurus/Translate';

interface TypeWriterProps {
  texts: string[]; // 要显示的文本数组
  speed?: number; // 打字速度（默认 100ms/字）
  deleteSpeed?: number; // 回删速度（默认 50ms/字）
  pauseBeforeDelete?: number; // 回删前的等待时间（默认 1000ms）
  pauseBeforeNextText?: number; // 显示下一个文本前的等待时间（默认 1000ms）
}

const TypeWriter: React.FC<TypeWriterProps> = ({
  texts,
  speed = 100,
  deleteSpeed = 50,
  pauseBeforeDelete = 1000,
  pauseBeforeNextText = 1000,
}) => {
  const [displayText, setDisplayText] = useState(''); // 当前显示的文本
  const [index, setIndex] = useState(0); // 当前字符的索引
  const [isDeleting, setIsDeleting] = useState(false); // 是否正在回删
  const [currentTextIndex, setCurrentTextIndex] = useState(0); // 当前显示的文本索引

  useEffect(() => {
    const currentText = texts[currentTextIndex]; // 当前要显示的文本

    if (!isDeleting && index < currentText.length) {
      // 逐字显示
      const timer = setTimeout(() => {
        setDisplayText((prev) => prev + currentText.charAt(index));
        setIndex((prev) => prev + 1);
      }, speed);

      // 清除定时器
      return () => clearTimeout(timer);
    } else if (isDeleting && index > 0) {
      // 回删
      const timer = setTimeout(() => {
        setDisplayText((prev) => prev.slice(0, -1));
        setIndex((prev) => prev - 1);
      }, deleteSpeed);

      // 清除定时器
      return () => clearTimeout(timer);
    } else if (index === currentText.length && !isDeleting) {
      // 显示完成后等待一段时间再开始回删
      const timer = setTimeout(() => {
        // 如果不是最后一个文本，则开始回删
        if (currentTextIndex < texts.length - 1) {
          setIsDeleting(true);
        }
      }, pauseBeforeDelete);

      return () => clearTimeout(timer);
    } else if (index === 0 && isDeleting) {
      // 回删完成后等待一段时间再开始输入下一个文本
      const timer = setTimeout(() => {
        setIsDeleting(false);
        setCurrentTextIndex((prev) => {
          const nextIndex = prev + 1;
          if (nextIndex < texts.length) {
            return nextIndex; // 切换到下一个文本
          } else {
            return prev; // 如果已经是最后一个文本，则停止
          }
        });
      }, pauseBeforeNextText);

      return () => clearTimeout(timer);
    }
  }, [index, isDeleting, currentTextIndex, texts, speed, deleteSpeed, pauseBeforeDelete, pauseBeforeNextText]);

  return (
    <div className={styles.typewriter}>
      <span className={styles.typewriterText}>{displayText}</span>
      <span className={styles.cursor}>{'<'}</span>
    </div>
  );
};

export default function Home(): JSX.Element {
  const translatedTexts = [
    translate({ message: 'helloWorld' }), // 翻译 'Hello\nWorld'
    translate({ message: 'welcome' }), // 翻译 'Welcome'
    translate({ message: 'clickHereToBlog' }), // 翻译 'Click here to my\nBlog👉'
  ];
  return (
    <Layout
      title={translate({ message: 'indexTitle' })}
      description={translate({ message: 'indexDescription' })}
    >
        <a href="/blog"  className={styles.typerIndexA}>
        <button className={styles.typerIndex}
            type='button'
            name="To Blog">
            <TypeWriter
            texts={translatedTexts}
            speed={200} // 打字速度
            deleteSpeed={50} // 回删速度
            pauseBeforeDelete={1000} // 回删前的等待时间
            pauseBeforeNextText={1000} // 显示下一个文本前的等待时间
            />
        </button>
        </a>
        <div className={styles.bg}></div>
    </Layout>
  );
}
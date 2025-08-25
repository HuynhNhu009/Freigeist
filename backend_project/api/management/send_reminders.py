from django.core.management.base import BaseCommand
from django.utils import timezone
from django.core.mail import send_mail
from api.models import Reminder
from datetime import datetime, timedelta

class Command(BaseCommand):
    help = 'Gửi email nhắc nhở trước 30 phút cho người dùng.'

    def handle(self, *args, **kwargs):
        now = timezone.localtime()  # thời gian hiện tại theo local
        today = now.date()

        # Lấy các Reminder ngày hôm nay, chưa gửi
        reminders = Reminder.objects.filter(
            rm_date=today,
            rm_status='pending'
        )

        sent_count = 0

        for r in reminders:
            # Ghép ngày và giờ nhắc nhở thành 1 datetime
            reminder_dt = datetime.combine(r.rm_date, r.rm_time)

            # Nếu thời gian hiện tại >= thời gian nhắc - 30 phút, thì gửi
            if now >= timezone.make_aware(reminder_dt - timedelta(minutes=30)):
                user = r.user
                if not user.user_email:
                    continue

                subject = f"⏰ Sắp tới: {r.rm_title}"
                message = f"""Xin chào {user.user_fullname},

Bạn có một nhắc nhở sắp tới trong vòng 30 phút:

📌 {r.rm_title}
📅 Ngày: {r.rm_date.strftime('%d/%m/%Y')}
🕒 Giờ: {r.rm_time.strftime('%H:%M')}
✉ Nội dung: {r.rm_content}

- Hệ thống Freigeist
"""

                try:
                    send_mail(
                        subject,
                        message,
                        'your_email@gmail.com',
                        [user.user_email],
                        fail_silently=False
                    )
                    r.rm_status = 'completed'
                    r.save()
                    sent_count += 1
                    self.stdout.write(self.style.SUCCESS(f"Gửi thành công: {user.user_email}"))
                except Exception as e:
                    self.stdout.write(self.style.ERROR(f"Lỗi gửi {user.user_email}: {str(e)}"))

        if sent_count == 0:
            self.stdout.write("⏳ Không có reminder nào cần gửi lúc này.")
        else:
            self.stdout.write(self.style.SUCCESS(f"✅ Đã gửi {sent_count} reminder(s)."))
